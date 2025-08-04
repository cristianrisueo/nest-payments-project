import { User } from '../entities/user.entity';
import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';

/**
 * Injection token for User Repository
 * Used for dependency injection since interfaces don't exist at runtime
 */
export const USER_REPOSITORY_TOKEN = 'USER_REPOSITORY_TOKEN';

/**
 * User Repository Interface.
 * Defines the contract for user persistence operations.
 * Implementation details are handled by infrastructure layer.
 */
export interface UserRepositoryInterface {
  /**
   * Saves a new user to the repository.
   * @param {User} user - The user to save.
   * @returns {Promise<void>} Promise that resolves when user is saved.
   * @throws {Error} If user already exists or save operation fails.
   */
  save(user: User): Promise<void>;

  /**
   * Finds a user by their email address.
   * @param {Email} email - The email to search for.
   * @returns {Promise<User | null>} The user if found, null otherwise.
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * Finds a user by their ID.
   * @param {string} id - The user ID to search for.
   * @returns {Promise<User | null>} The user if found, null otherwise.
   */
  findById(id: string): Promise<User | null>;

  /**
   * Checks if a user with the given email already exists.
   * @param {Email} email - The email to check.
   * @returns {Promise<boolean>} True if user exists, false otherwise.
   */
  existsByEmail(email: Email): Promise<boolean>;

  /**
   * Updates a user's password.
   * @param {string} id - The user ID.
   * @param {Password} newPassword - The new hashed password.
   * @returns {Promise<void>} Promise that resolves when password is updated.
   */
  updatePassword(id: string, newPassword: Password): Promise<void>;

  /**
   * Deletes a user by their ID.
   * @param {string} id - The user ID to delete.
   * @returns {Promise<void>} Promise that resolves when user is deleted.
   * @throws {Error} If user doesn't exist or delete operation fails.
   */
  deleteById(id: string): Promise<void>;
}
