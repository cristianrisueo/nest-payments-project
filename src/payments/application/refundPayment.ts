import { Injectable, Inject } from '@nestjs/common';
import { TransactionId } from '../domain/value-objects/transactionId';
import { Amount } from '../../shared/value-objects/amount';
import {
  PaymentRepositoryInterface,
  PAYMENT_REPOSITORY_TOKEN,
} from '../domain/repositories/payment.repository';
import {
  UserRepositoryInterface,
  USER_REPOSITORY_TOKEN,
} from '../../users/domain/repositories/user.repository';

/**
 * Request object for refunding a payment.
 */
export interface RefundPaymentRequest {
  transactionId: string;
}

/**
 * Response object for refunding a payment.
 */
export interface RefundPaymentResponse {
  id: string;
  status: string;
  refundedAmount: string;
  message: string;
  senderNewBalance: string;
  receiverNewBalance: string;
}

/**
 * Use case for refunding a completed payment.
 * Handles the business logic for payment reversal and balance restoration.
 * Coordinates payment status change and money transfer reversal.
 */
@Injectable()
export class RefundPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepositoryInterface,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  /**
   * Refunds a completed payment and reverses the money transfer.
   * @param {RefundPaymentRequest} request - The refund request data
   * @returns {Promise<RefundPaymentResponse>} The refund result
   * @throws {Error} If payment cannot be refunded
   */
  async execute(request: RefundPaymentRequest): Promise<RefundPaymentResponse> {
    // Creates the transaction ID value object
    const transactionId = TransactionId.create(request.transactionId);

    // Finds the payment by transaction ID
    const payment = await this.paymentRepository.findById(transactionId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    // Validates that payment can be refunded (domain business rule)
    // Error will thrown if payment cannot be refunded (completed status required)
    payment.refund();

    // Loads original sender and receiver users
    const originalSender = await this.userRepository.findById(
      payment.fromUserId,
    );
    if (!originalSender) {
      throw new Error('Original sender user not found');
    }

    const originalReceiver = await this.userRepository.findById(
      payment.toUserId,
    );
    if (!originalReceiver) {
      throw new Error('Original receiver user not found');
    }

    // Checks if receiver has sufficient balance for refund
    if (originalReceiver.balance.valueCents < payment.amount.valueCents) {
      throw new Error(
        `Refund failed: Receiver has insufficient balance. Required: ${payment.amount.toFormattedString()}, Available: ${originalReceiver.balance.toFormattedString()}`,
      );
    }

    // Reverses the money transfer
    // Original sender gets money back, original receiver loses money
    const newSenderBalance =
      originalSender.balance.valueCents + payment.amount.valueCents;
    const newReceiverBalance =
      originalReceiver.balance.valueCents - payment.amount.valueCents;

    // Creates new Amount instances for the updated balances
    const senderAmount = Amount.create(newSenderBalance);
    const receiverAmount = Amount.create(newReceiverBalance);

    // Updates user balances in the database
    await this.userRepository.updateBalance(originalSender.id, senderAmount);
    await this.userRepository.updateBalance(
      originalReceiver.id,
      receiverAmount,
    );

    // Updates the payment status to refunded in the database
    await this.paymentRepository.update(payment);

    // Returns success response with balance information
    return {
      id: payment.id.value,
      status: payment.status,
      refundedAmount: payment.amount.toFormattedString(),
      message: `Payment refunded successfully. Returned ${payment.amount.toFormattedString()} from ${originalReceiver.email.value} to ${originalSender.email.value}`,
      senderNewBalance: senderAmount.toFormattedString(),
      receiverNewBalance: receiverAmount.toFormattedString(),
    };
  }
}
