import { Injectable, Inject } from '@nestjs/common';
import { Email } from '../domain/value-objects/email';
import {
  UserRepositoryInterface,
  USER_REPOSITORY_TOKEN,
} from '../domain/repositories/user.repository';
import { JwtService } from '../../shared/auth/jwt.service';

/**
 * Request object for user authentication.
 */
export interface AuthenticateUserRequest {
  email: string;
  password: string;
}

/**
 * Response object for user authentication.
 */
export interface AuthenticateUserResponse {
  id: string;
  email: string;
  isAuthenticated: boolean;
  accessToken: string;
}

/**
 * Use case for authenticating an existing user.
 * Handles the business logic for user authentication.
 * Validates credentials and coordinates domain objects.
 */
@Injectable()
export class AuthenticateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * Authenticates a user with their credentials.
   * @param {AuthenticateUserRequest} userData - The body request with user's data.
   * @returns {Promise<AuthenticateUserResponse>} The authentication result.
   * @throws {Error} If user doesn't exist or authentication fails.
   */
  async execute(
    userData: AuthenticateUserRequest,
  ): Promise<AuthenticateUserResponse> {
    // Creates an email value object (passing regex validations)
    const emailVO = Email.create(userData.email);

    // Finds the user by email. Throws an error if user doesn't exist.
    const user = await this.userRepository.findByEmail(emailVO);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verifies the password using the User entity method
    const isValidPassword = await user.authenticate(userData.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generates JWT token for authenticated user
    const accessToken = this.jwtService.generateToken(
      user.id,
      user.email.value,
    );

    // Returns success response
    return {
      id: user.id,
      email: user.email.value,
      isAuthenticated: true,
      accessToken,
    };
  }
}
