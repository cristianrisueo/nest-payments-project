import { Injectable, Inject } from '@nestjs/common';
import {
  UserRepositoryInterface,
  USER_REPOSITORY_TOKEN,
} from '../domain/repositories/user.repository';

/**
 * Request object for changing user password.
 */
export interface ChangePasswordRequest {
  id: string;
  currentPassword: string;
  newPassword: string;
}

/**
 * Response object for changing user password.
 */
export interface ChangePasswordResponse {
  id: string;
  message: string;
}

/**
 * Use case for changing a user's password.
 * Handles the business logic for password updates.
 * Validates current password and coordinates domain objects.
 */
@Injectable()
export class ChangePasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly userRepository: UserRepositoryInterface,
  ) {}

  /**
   * Changes a user's password after validating their current password.
   * @param {ChangePasswordRequest} userData - The body request with user's password data.
   * @returns {Promise<ChangePasswordResponse>} The password change confirmation.
   * @throws {Error} If user doesn't exist, current password is wrong, or update fails.
   */
  async execute(
    userData: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    // Finds the user by ID. Throws an error if user doesn't exist.
    const user = await this.userRepository.findById(userData.id);
    if (!user) {
      throw new Error('User not found');
    }

    // Verifies the current password before allowing change
    const isCurrentPasswordValid = await user.authenticate(
      userData.currentPassword,
    );
    if (!isCurrentPasswordValid) {
      throw new Error('Current password is incorrect');
    }

    // Creates new user instance with updated password
    const updatedUser = await user.changePassword(userData.newPassword);

    // Updates the password in the repository. Throws an error if update fails.
    await this.userRepository.updatePassword(userData.id, updatedUser.password);

    // Returns password change confirmation response
    return {
      id: userData.id,
      message: 'Password successfully updated',
    };
  }
}
