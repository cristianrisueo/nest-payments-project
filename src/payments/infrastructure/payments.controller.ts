import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  ForbiddenException,
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
import { Auth, CurrentUser } from '../../shared/auth/auth.decorator';

/**
 * Payment Controller.
 * Handles HTTP requests for payment operations.
 * All routes are protected with JWT authentication.
 * Users can only access their own payment data.
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
   * Only authenticated users can send payments from their own account.
   * @param {SendPaymentRequest} request - Payment creation data
   * @param {string} currentUserId - ID of authenticated user from JWT
   * @returns {Promise<SendPaymentResponse>} The created payment details
   */
  @Auth()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async sendPayment(
    @Body() request: SendPaymentRequest,
    @CurrentUser('id') currentUserId: string,
  ): Promise<SendPaymentResponse> {
    // Ensure user can only send payments from their own account
    if (request.fromUserId !== currentUserId) {
      throw new ForbiddenException(
        'You can only send payments from your own account',
      );
    }

    return await this.sendPaymentUseCase.execute(request);
  }

  /**
   * Retrieves a payment by its transaction ID.
   * Users can only view payments they are involved in (sender or receiver).
   * @param {string} transactionId - The transaction ID to retrieve
   * @param {string} currentUserId - ID of authenticated user from JWT
   * @returns {Promise<GetPaymentByIdResponse>} The payment details
   */
  @Auth()
  @Get(':transactionId')
  @HttpCode(HttpStatus.OK)
  async getPaymentById(
    @Param('transactionId') transactionId: string,
    @CurrentUser('id') currentUserId: string,
  ): Promise<GetPaymentByIdResponse> {
    const request: GetPaymentByIdRequest = {
      transactionId,
    };

    const payment = await this.getPaymentByIdUseCase.execute(request);

    // Ensure user can only view payments they are involved in
    if (
      payment.fromUserId !== currentUserId &&
      payment.toUserId !== currentUserId
    ) {
      throw new ForbiddenException('You can only view your own payments');
    }

    return payment;
  }

  /**
   * Retrieves payment history for a user.
   * Users can only view their own payment history.
   * @param {string} userId - The user ID to get payment history for
   * @param {string} currentUserId - ID of authenticated user from JWT
   * @returns {Promise<GetUserPaymentHistoryResponse>} The user's payment history
   */
  @Auth()
  @Get('user/:userId/history')
  @HttpCode(HttpStatus.OK)
  async getUserPaymentHistory(
    @Param('userId') userId: string,
    @CurrentUser('id') currentUserId: string,
  ): Promise<GetUserPaymentHistoryResponse> {
    // Ensure user can only view their own payment history
    if (userId !== currentUserId) {
      throw new ForbiddenException(
        'You can only view your own payment history',
      );
    }

    const request: GetUserPaymentHistoryRequest = {
      userId,
    };

    return await this.getUserPaymentHistoryUseCase.execute(request);
  }

  /**
   * Processes a pending payment.
   * Users can only process payments they sent.
   * @param {string} transactionId - The transaction ID to process
   * @param {string} currentUserId - ID of authenticated user from JWT
   * @returns {Promise<ProcessPaymentResponse>} The processing result
   */
  @Auth()
  @Patch(':transactionId/process')
  @HttpCode(HttpStatus.OK)
  async processPayment(
    @Param('transactionId') transactionId: string,
    @CurrentUser('id') currentUserId: string,
  ): Promise<ProcessPaymentResponse> {
    // First, verify the user owns this payment
    const payment = await this.getPaymentByIdUseCase.execute({ transactionId });

    if (payment.fromUserId !== currentUserId) {
      throw new ForbiddenException('You can only process payments you sent');
    }

    const request: ProcessPaymentRequest = {
      transactionId,
    };

    return await this.processPaymentUseCase.execute(request);
  }

  /**
   * Refunds a completed payment.
   * Users can only refund payments they originally sent.
   * @param {string} transactionId - The transaction ID to refund
   * @param {string} currentUserId - ID of authenticated user from JWT
   * @returns {Promise<RefundPaymentResponse>} The refund result
   */
  @Auth()
  @Patch(':transactionId/refund')
  @HttpCode(HttpStatus.OK)
  async refundPayment(
    @Param('transactionId') transactionId: string,
    @CurrentUser('id') currentUserId: string,
  ): Promise<RefundPaymentResponse> {
    // First, verify the user owns this payment
    const payment = await this.getPaymentByIdUseCase.execute({ transactionId });

    if (payment.fromUserId !== currentUserId) {
      throw new ForbiddenException('You can only refund payments you sent');
    }

    const request: RefundPaymentRequest = {
      transactionId,
    };

    return await this.refundPaymentUseCase.execute(request);
  }
}
