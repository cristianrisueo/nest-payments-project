import { Injectable, Inject } from '@nestjs/common';
import {
  UserRepositoryInterface,
  USER_REPOSITORY_TOKEN,
} from '../domain/repositories/user.repository';

/**
 * Request object for deleting user by ID.
 */
export interface DeleteUserRequest {
  id: string;
}

/**
 * Response object for deleting user by ID.
 */
export interface DeleteUserResponse {
  id: string;
  message: string;
}

/**
 * Use case for deleting a user by their ID.
 * Handles the business logic for user deletion.
 * Coordinates domain objects and repository access.
 */
@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  /**
   * Deletes a user by their ID.
   * @param {DeleteUserRequest} userData - The body request with user's ID.
   * @returns {Promise<DeleteUserResponse>} The deletion confirmation.
   * @throws {Error} If user doesn't exist or deletion fails.
   */
  async execute(userData: DeleteUserRequest): Promise<DeleteUserResponse> {
    // Checks if the user exists before attempting deletion
    const user = await this.userRepository.findById(userData.id);
    if (!user) {
      throw new Error('User not found');
    }

    // Deletes the user from the repository. Throws an error if deletion fails.
    await this.userRepository.deleteById(userData.id);

    // Returns deletion confirmation response
    return {
      id: userData.id,
      message: 'User successfully deleted',
    };
  }
}
