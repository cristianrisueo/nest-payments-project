import { randomUUID } from 'crypto';
import { Email } from '../value-objects/email';
import { Password } from '../value-objects/password';

/**
 * User Entity.
 * Represents a user in the system with email and password authentication.
 * Encapsulates user business logic and domain rules.
 */
export class User {
  private constructor(
    private readonly _id: string,
    private readonly _email: Email,
    private readonly _password: Password,
    private readonly _createdAt: Date,
  ) {}

  /**
   * Factory method to create a new User from registration data.
   * @param {string} email - The user's email address.
   * @param {string} plainTextPassword - The user's plaintext password.
   * @returns {Promise<User>} A new User instance with hashed password.
   */
  static async createNewUser(
    email: string,
    plainTextPassword: string,
  ): Promise<User> {
    const id = randomUUID();
    const emailVO = Email.create(email);
    const passwordVO = await Password.createFromPlaintext(plainTextPassword);

    return new User(id, emailVO, passwordVO, new Date());
  }

  /**
   * Factory method to recreate a User from database data.
   * Used when loading users from database where password is already hashed.
   * @param {string} id - The user's ID.
   * @param {string} email - The user's email address.
   * @param {string} hashedPassword - The user's already hashed password.
   * @param {Date} createdAt - When the user was created.
   * @returns {User} A recreated User instance from database data.
   */
  static createFromDatabase(
    id: string,
    email: string,
    hashedPassword: string,
    createdAt: Date,
  ): User {
    const emailVO = Email.create(email);
    const passwordVO = Password.createFromHash(hashedPassword);

    return new User(id, emailVO, passwordVO, createdAt);
  }

  /**
   * Authenticates the user with a plaintext password.
   * @param {string} plainTextPassword - The password to verify.
   * @returns {Promise<boolean>} True if authentication succeeds, false otherwise.
   */
  async authenticate(plainTextPassword: string): Promise<boolean> {
    return await this._password.verify(plainTextPassword);
  }

  /**
   * Gets the user's ID.
   * @returns {string} The user ID.
   */
  get id(): string {
    return this._id;
  }

  /**
   * Gets the user's email.
   * @returns {Email} The user's email value object.
   */
  get email(): Email {
    return this._email;
  }

  /**
   * Gets the user's hashed password.
   * @returns {Password} The user's password value object.
   */
  get password(): Password {
    return this._password;
  }

  /**
   * Gets when the user was created.
   * @returns {Date} The user's creation date.
   */
  get createdAt(): Date {
    return this._createdAt;
  }

  /**
   * Compares this user with another user.
   * Two users are considered equal if they have the same ID.
   * @param {User} other - The other user to compare with.
   * @returns {boolean} True if both users have the same ID, false otherwise.
   */
  equals(other: User): boolean {
    return this._id === other._id;
  }

  /**
   * Changes the user's password and returns a new User instance.
   * Maintains immutability by creating a new User with the updated password.
   * @param {string} newPlaintextPassword - The new plaintext password.
   * @returns {Promise<User>} A new User instance with the updated password.
   */
  async changePassword(newPlaintextPassword: string): Promise<User> {
    const newPasswordVO =
      await Password.createFromPlaintext(newPlaintextPassword);

    return new User(this._id, this._email, newPasswordVO, this._createdAt);
  }

  /**
   * Converts to string representation.
   * @returns {string} String representation of the user
   */
  toString(): string {
    return `User ${this._email.value} (ID: ${this._id})`;
  }
}
