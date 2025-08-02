import { Injectable, Inject } from '@nestjs/common';
import { User } from '../domain/entities/user.entity';
import { Email } from '../domain/value-objects/email';
import {
  UserRepositoryInterface,
  USER_REPOSITORY_TOKEN,
} from '../domain/repositories/user.repository';

/**
 * Request object for user registration.
 */
export interface RegisterUserRequest {
  email: string;
  password: string;
}

/**
 * Response object for user registration.
 */
export interface RegisterUserResponse {
  id: string;
  email: string;
  createdAt: Date;
}

/**
 * Use case for registering a new user.
 * Handles the business logic for user registration.
 * Validates business rules and coordinates domain objects.
 */
@Injectable()
export class RegisterUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  /**
   * Registers a new user in the system.
   * @param {RegisterUserRequest} userData - The body request with user's data.
   * @returns {Promise<RegisterUserResponse>} The registration result.
   * @throws {Error} If user already exists or registration fails.
   */
  async execute(userData: RegisterUserRequest): Promise<RegisterUserResponse> {
    // Creates an email value object (passing regex validations)
    const emailVO = Email.create(userData.email);

    // Checks if the user already exists. Throws an error if it does.
    const existingUser = await this.userRepository.existsByEmail(emailVO);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Creates new user through the User entity factory method
    const user = await User.createNewUser(userData.email, userData.password);

    // Saves the new user to the repository. Throws an error if save fails.
    await this.userRepository.save(user);

    // Returns success response
    return {
      id: user.id,
      email: user.email.value,
      createdAt: user.createdAt,
    };
  }
}
