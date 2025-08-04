import { Injectable, Inject } from '@nestjs/common';
import { TransactionId } from '../domain/value-objects/transactionId';
import {
  PaymentRepositoryInterface,
  PAYMENT_REPOSITORY_TOKEN,
} from '../domain/repositories/payment.repository';
import {
  UserRepositoryInterface,
  USER_REPOSITORY_TOKEN,
} from '../../users/domain/repositories/user.repository';
import { Amount } from '../../shared/value-objects/amount';

/**
 * Request object for processing a payment.
 */
export interface ProcessPaymentRequest {
  transactionId: string;
}

/**
 * Response object for processing a payment.
 */
export interface ProcessPaymentResponse {
  id: string;
  status: string;
  processedAt: Date | null;
  message: string;
  senderNewBalance?: string;
  receiverNewBalance?: string;
}

/**
 * Use case for processing a payment transaction with balance logic.
 * Handles real P2P money transfer between users.
 * Validates balances and coordinates money movement.
 */
@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepositoryInterface,
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  /**
   * Processes a pending payment with real balance checks and transfers.
   * @param {ProcessPaymentRequest} processData - The processing request data
   * @returns {Promise<ProcessPaymentResponse>} The processing result
   * @throws {Error} If payment cannot be processed
   */
  async execute(
    processData: ProcessPaymentRequest,
  ): Promise<ProcessPaymentResponse> {
    // Creates the transaction ID value object from the request data
    const transactionId = TransactionId.create(processData.transactionId);

    // Finds the payment by transaction ID
    const payment = await this.paymentRepository.findById(transactionId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    // Starts payment processing
    payment.process();
    await this.paymentRepository.update(payment);

    // Gets sender and receiver of the payment
    const sender = await this.userRepository.findById(payment.fromUserId);
    if (!sender) {
      payment.fail('Sender user not found');
      await this.paymentRepository.update(payment);

      return {
        id: payment.id.value,
        status: payment.status,
        processedAt: payment.processedAt,
        message: 'Payment failed: Sender user not found',
      };
    }

    const receiver = await this.userRepository.findById(payment.toUserId);
    if (!receiver) {
      payment.fail('Receiver user not found');
      await this.paymentRepository.update(payment);

      return {
        id: payment.id.value,
        status: payment.status,
        processedAt: payment.processedAt,
        message: 'Payment failed: Receiver user not found',
      };
    }

    // Checks if sender has sufficient balance
    if (sender.balance.valueCents < payment.amount.valueCents) {
      payment.fail('Insufficient balance');
      await this.paymentRepository.update(payment);

      return {
        id: payment.id.value,
        status: payment.status,
        processedAt: payment.processedAt,
        message: `Payment failed: Insufficient balance. Required: ${payment.amount.toFormattedString()}, Available: ${sender.balance.toFormattedString()}`,
      };
    }

    // Performs the money transfer
    const newSenderBalance =
      sender.balance.valueCents - payment.amount.valueCents;
    const newReceiverBalance =
      receiver.balance.valueCents + payment.amount.valueCents;

    // Creates new Amount instances for the updated balances
    const senderAmount = Amount.create(newSenderBalance);
    const receiverAmount = Amount.create(newReceiverBalance);

    // Updates user balances in the database
    await this.userRepository.updateBalance(sender.id, senderAmount);
    await this.userRepository.updateBalance(receiver.id, receiverAmount);

    // Completes the payment
    payment.complete();
    await this.paymentRepository.update(payment);

    // Returns success response with balances information
    return {
      id: payment.id.value,
      status: payment.status,
      processedAt: payment.processedAt,
      message: `Payment completed successfully. Transferred ${payment.amount.toFormattedString()} from ${sender.email.value} to ${receiver.email.value}`,
      senderNewBalance: senderAmount.toFormattedString(),
      receiverNewBalance: receiverAmount.toFormattedString(),
    };
  }
}
