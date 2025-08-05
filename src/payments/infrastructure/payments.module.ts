import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Domain
import { PAYMENT_REPOSITORY_TOKEN } from '../domain/repositories/payment.repository';

// Application
import { SendPaymentUseCase } from '../application/sendPayment';
import { ProcessPaymentUseCase } from '../application/processPayment';
import { GetPaymentByIdUseCase } from '../application/getPaymentById';
import { GetUserPaymentHistoryUseCase } from '../application/getPaymentHistory';
import { RefundPaymentUseCase } from '../application/refundPayment';

// Infrastructure
import { PaymentRepository } from '../infrastructure/repositories/mongo.repository';
import { PaymentSchema } from '../infrastructure/schemas/mongo.schema';
import { PaymentController } from '../infrastructure/payments.controller';

// Cross-domain dependency (for ProcessPayment and RefundPayment use cases)
import { USER_REPOSITORY_TOKEN } from '../../users/domain/repositories/user.repository';
import { UserRepository } from '../../users/infrastructure/repositories/mongo.repository';
import { UserSchema } from '../../users/infrastructure/schemas/mongo.schema';

/**
 * Payments Module.
 * Configures and wires together all components of the payments domain.
 * Follows hexagonal architecture principles with clean dependency injection.
 */
@Module({
  // Registers Payment schema with the 'payments' database connection
  // Also imports User schema for cross-domain operations
  imports: [
    MongooseModule.forFeature(
      [{ name: 'Payment', schema: PaymentSchema }],
      'payments',
    ),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }], 'users'),
  ],
  // Controllers (HTTP layer)
  controllers: [PaymentController],
  providers: [
    // Use cases (Application layer)
    SendPaymentUseCase,
    ProcessPaymentUseCase,
    GetPaymentByIdUseCase,
    GetUserPaymentHistoryUseCase,
    RefundPaymentUseCase,

    // Payment repository implementation (Infrastructure layer)
    {
      provide: PAYMENT_REPOSITORY_TOKEN,
      useClass: PaymentRepository,
    },

    // User repository implementation (for cross-domain operations)
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
  ],
  // Exports the use cases so other modules can use them
  exports: [
    SendPaymentUseCase,
    ProcessPaymentUseCase,
    GetPaymentByIdUseCase,
    GetUserPaymentHistoryUseCase,
    RefundPaymentUseCase,
  ],
})
export class PaymentsModule {}
