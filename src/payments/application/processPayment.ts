import { Injectable, Inject } from '@nestjs/common';
import { TransactionId } from '../domain/value-objects/transactionId';
import {
  PaymentRepositoryInterface,
  PAYMENT_REPOSITORY_TOKEN,
} from '../domain/repositories/payment.repository';

/**
 * Request object for processing a payment.
 */
export interface ProcessPaymentRequest {
  transactionId: string;
  shouldSucceed: boolean; // For MVP simulation - real implementation would call payment gateway
}

/**
 * Response object for processing a payment.
 */
export interface ProcessPaymentResponse {
  id: string;
  status: string;
  processedAt: Date | null;
  message: string;
}

/**
 * Use case for processing a payment transaction.
 * Simulates payment gateway processing for MVP.
 * Handles payment status transitions and validation.
 */
@Injectable()
export class ProcessPaymentUseCase {
  constructor(
    @Inject(PAYMENT_REPOSITORY_TOKEN)
    private readonly paymentRepository: PaymentRepositoryInterface,
  ) {}

  /**
   * Processes a pending payment transaction.
   * @param {ProcessPaymentRequest} processData - The processing request data
   * @returns {Promise<ProcessPaymentResponse>} The processing result
   * @throws {Error} If payment cannot be processed
   */
  async execute(
    processData: ProcessPaymentRequest,
  ): Promise<ProcessPaymentResponse> {
    // Creates the transaction ID value object
    const transactionId = TransactionId.create(processData.transactionId);

    // Finds the payment by transaction ID
    const payment = await this.paymentRepository.findById(transactionId);
    if (!payment) {
      throw new Error('Payment not found');
    }

    // Starts payment processing
    payment.process();

    // Saves the processing status
    await this.paymentRepository.update(payment);

    // Simulates payment gateway processing (for MVP)
    if (processData.shouldSucceed) {
      // Completes the payment
      payment.complete();
      await this.paymentRepository.update(payment);

      return {
        id: payment.id.value,
        status: payment.status,
        processedAt: payment.processedAt,
        message: 'Payment completed successfully',
      };
    } else {
      // Fails the payment
      payment.fail('Insufficient funds'); // Simulated failure reason
      await this.paymentRepository.update(payment);

      return {
        id: payment.id.value,
        status: payment.status,
        processedAt: payment.processedAt,
        message: 'Payment failed: Insufficient funds',
      };
    }
  }
}
