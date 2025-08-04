import { Injectable, Inject } from '@nestjs/common';
import { Payment } from '../domain/entities/payment.entity';
import { Amount } from '../../shared/value-objects/amount';
import { Currency } from '../domain/value-objects/currency';
import { PaymentMethod } from '../domain/value-objects/paymentMethod';
import {
  PaymentRepositoryInterface,
  PAYMENT_REPOSITORY_TOKEN,
} from '../domain/repositories/payment.repository';

/**
 * Request object for sending a payment.
 */
export interface SendPaymentRequest {
  fromUserId: string;
  toUserId: string;
  amountCents: number;
  currencyCode: string;
  paymentMethodType: string;
  paymentMethodLastFour: string;
  description: string;
}

/**
 * Response object for sending a payment.
 */
export interface SendPaymentResponse {
  id: string;
  fromUserId: string;
  toUserId: string;
  amount: string;
  currency: string;
  paymentMethod: string;
  status: string;
  description: string;
  createdAt: Date;
}

/**
 * Use case for sending a new P2P payment.
 * Handles the business logic for payment creation.
 * Validates input and coordinates domain objects.
 */
@Injectable()
export class SendPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepositoryInterface,
  ) {}

  /**
   * Sends a new P2P payment between users.
   * @param {SendPaymentRequest} paymentData - The payment request data
   * @returns {Promise<SendPaymentResponse>} The created payment details
   * @throws {Error} If payment creation fails
   */
  async execute(paymentData: SendPaymentRequest): Promise<SendPaymentResponse> {
    // Creates the value objects (with their built-in validation)
    const amount = Amount.create(paymentData.amountCents);
    const currency = Currency.create(paymentData.currencyCode);
    const paymentMethod = PaymentMethod.create(
      paymentData.paymentMethodType,
      paymentData.paymentMethodLastFour,
    );

    // Creates a new payment
    const payment = Payment.createNew(
      paymentData.fromUserId,
      paymentData.toUserId,
      amount,
      currency,
      paymentMethod,
      paymentData.description,
    );

    // Saves the payment to the repository
    await this.paymentRepository.save(payment);

    // Returns the response
    return {
      id: payment.id.value,
      fromUserId: payment.fromUserId,
      toUserId: payment.toUserId,
      amount: payment.amount.toFormattedString(),
      currency: payment.currency.code,
      paymentMethod: payment.paymentMethod.toString(),
      status: payment.status,
      description: payment.description,
      createdAt: payment.createdAt,
    };
  }
}
