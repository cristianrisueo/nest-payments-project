import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  SendPaymentUseCase,
  SendPaymentRequest,
  SendPaymentResponse,
} from '../application/sendPayment';
import {
  ProcessPaymentUseCase,
  ProcessPaymentRequest,
  ProcessPaymentResponse,
} from '../application/processPayment';
import {
  GetPaymentByIdUseCase,
  GetPaymentByIdRequest,
  GetPaymentByIdResponse,
} from '../application/getPaymentById';
import {
  GetUserPaymentHistoryUseCase,
  GetUserPaymentHistoryRequest,
  GetUserPaymentHistoryResponse,
} from '../application/getPaymentHistory';
import {
  RefundPaymentUseCase,
  RefundPaymentRequest,
  RefundPaymentResponse,
} from '../application/refundPayment';

/**
 * Payment Controller.
 * Handles HTTP requests for payment operations.
 * Follows REST conventions and delegates to use cases.
 */
@Controller('payments')
export class PaymentController {
  constructor(
    private readonly sendPaymentUseCase: SendPaymentUseCase,
    private readonly processPaymentUseCase: ProcessPaymentUseCase,
    private readonly getPaymentByIdUseCase: GetPaymentByIdUseCase,
    private readonly getUserPaymentHistoryUseCase: GetUserPaymentHistoryUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase,
  ) {}

  /**
   * Creates a new payment request.
   * @param {SendPaymentRequest} request - Payment creation data
   * @returns {Promise<SendPaymentResponse>} The created payment details
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async sendPayment(
    @Body() request: SendPaymentRequest,
  ): Promise<SendPaymentResponse> {
    return await this.sendPaymentUseCase.execute(request);
  }

  /**
   * Processes a pending payment.
   * @param {string} transactionId - The transaction ID to process
   * @returns {Promise<ProcessPaymentResponse>} The processing result
   */
  @Patch(':transactionId/process')
  @HttpCode(HttpStatus.OK)
  async processPayment(
    @Param('transactionId') transactionId: string,
  ): Promise<ProcessPaymentResponse> {
    const request: ProcessPaymentRequest = {
      transactionId,
    };

    return await this.processPaymentUseCase.execute(request);
  }

  /**
   * Retrieves a payment by its transaction ID.
   * @param {string} transactionId - The transaction ID to retrieve
   * @returns {Promise<GetPaymentByIdResponse>} The payment details
   */
  @Get(':transactionId')
  @HttpCode(HttpStatus.OK)
  async getPaymentById(
    @Param('transactionId') transactionId: string,
  ): Promise<GetPaymentByIdResponse> {
    const request: GetPaymentByIdRequest = {
      transactionId,
    };

    return await this.getPaymentByIdUseCase.execute(request);
  }

  /**
   * Retrieves payment history for a user.
   * @param {string} userId - The user ID to get payment history for
   * @returns {Promise<GetUserPaymentHistoryResponse>} The user's payment history
   */
  @Get('user/:userId/history')
  @HttpCode(HttpStatus.OK)
  async getUserPaymentHistory(
    @Param('userId') userId: string,
  ): Promise<GetUserPaymentHistoryResponse> {
    const request: GetUserPaymentHistoryRequest = {
      userId,
    };

    return await this.getUserPaymentHistoryUseCase.execute(request);
  }

  /**
   * Refunds a completed payment.
   * @param {string} transactionId - The transaction ID to refund
   * @returns {Promise<RefundPaymentResponse>} The refund result
   */
  @Patch(':transactionId/refund')
  @HttpCode(HttpStatus.OK)
  async refundPayment(
    @Param('transactionId') transactionId: string,
  ): Promise<RefundPaymentResponse> {
    const request: RefundPaymentRequest = {
      transactionId,
    };

    return await this.refundPaymentUseCase.execute(request);
  }
}
