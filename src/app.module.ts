import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

// Shared infrastructure
import { dbConfig } from './shared/db/db.config';
import { DbModule } from './shared/db/db.module';
import { DomainExceptionFilter } from './shared/filters/exception.filter';

// Domain modules
import { UsersModule } from './users/infrastructure/users.module';
import { PaymentsModule } from './payments/infrastructure/payments.module';

/**
 * Root Application Module.
 * Configures the main application with all domain modules and shared infrastructure.
 * Follows hexagonal architecture with clean module separation.
 */
@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [dbConfig],
    }),

    // Shared infrastructure
    DbModule,

    // Domain modules
    UsersModule,
    PaymentsModule,
  ],
  providers: [
    // Global exception filter for domain errors
    {
      provide: APP_FILTER,
      useClass: DomainExceptionFilter,
    },
  ],
})
export class AppModule {}
