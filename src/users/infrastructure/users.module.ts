import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Shared infrastructure
import { AuthModule } from '../../shared/auth/auth.module';

// Domain
import { USER_REPOSITORY_TOKEN } from '../domain/repositories/user.repository';

// Application
import { RegisterUserUseCase } from '../application/registerUser';
import { AuthenticateUserUseCase } from '../application/authenticateUser';
import { GetUserByIdUseCase } from '../application/getUserById';
import { GetUserByEmailUseCase } from '../application/getUserByEmail';
import { DeleteUserUseCase } from '../application/deleteUser';
import { ChangePasswordUseCase } from '../application/changePassword';
import { UpdateBalanceUseCase } from '../application/updateBalance';

// Infrastructure
import { UserRepository } from '../infrastructure/repositories/mongo.repository';
import { UserSchema } from '../infrastructure/schemas/mongo.schema';
import { UserController } from './users.controller';

/**
 * Users Module.
 * Configures and wires together all components of the users domain.
 * Follows hexagonal architecture principles with clean dependency injection.
 */
@Module({
  imports: [
    // Registers User schema with the 'users' database connection
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }], 'users'),

    // Import Auth module for JWT functionality
    AuthModule,
  ],
  // Controllers (HTTP layer)
  controllers: [UserController],
  providers: [
    // Use cases (Application layer)
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    GetUserByIdUseCase,
    GetUserByEmailUseCase,
    DeleteUserUseCase,
    ChangePasswordUseCase,
    UpdateBalanceUseCase,

    // Repository implementation (Infrastructure layer)
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository,
    },
  ],
  // Exports the use cases so other modules can use them
  exports: [
    RegisterUserUseCase,
    AuthenticateUserUseCase,
    GetUserByIdUseCase,
    GetUserByEmailUseCase,
    DeleteUserUseCase,
    ChangePasswordUseCase,
    UpdateBalanceUseCase,
  ],
})
export class UsersModule {}
