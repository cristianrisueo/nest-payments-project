import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Domain
import { USER_REPOSITORY_TOKEN } from '../domain/repositories/user.repository';

// Application
import { RegisterUserUseCase } from '../application/registerUser';
import { AuthenticateUserUseCase } from '../application/authenticateUser';
import { GetUserByIdUseCase } from '../application/getUserById';
import { GetUserByEmailUseCase } from '../application/getUserByEmail';
import { DeleteUserUseCase } from '../application/deleteUser';
import { ChangePasswordUseCase } from '../application/changePassword';

// Infrastructure
import { UserRepository } from '../infrastructure/repositories/mongo.repository';
import { UserSchema } from '../infrastructure/schemas/mongo.schema';
import { UserController } from '../infrastructure/user.controller';

/**
 * Users Module
 * Configures and wires together all components of the users domain.
 * Follows hexagonal architecture principles with clean dependency injection.
 */
@Module({
  // Registers User schema with the 'users' database connection
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }], 'users'),
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
  ],
})
export class UsersModule {}
