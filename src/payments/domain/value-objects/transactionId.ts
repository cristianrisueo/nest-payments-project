import { randomUUID } from 'crypto';

/**
 * TransactionId Value Object.
 * Represents a unique transaction identifier with validation.
 * Immutable and ensures unique identification of payments.
 */
export class TransactionId {
  private constructor(private readonly _value: string) {}

  /**
   * Factory method to create a TransactionId from string value.
   * This methos will be used when loading existing transactions from DB.
   * @param {string} value - The transaction ID string
   * @returns {TransactionId} A new TransactionId instance
   * @throws {Error} If the value is invalid
   */
  static create(value: string): TransactionId {
    if (!value || typeof value !== 'string') {
      throw new Error('Transaction ID is required and must be a string');
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      throw new Error('Transaction ID cannot be empty');
    }

    if (trimmedValue.length > 50) {
      throw new Error('Transaction ID cannot exceed 50 characters');
    }

    return new TransactionId(trimmedValue);
  }

  /**
   * Factory method to generate a new unique TransactionId with PAY prefix.
   * This method will be used when creating a new payment transaction.
   * @returns {TransactionId} A new unique TransactionId
   */
  static generate(): TransactionId {
    const uuid = randomUUID();
    const value = `PAY_${uuid}`;

    return new TransactionId(value);
  }

  /**
   * Gets the transaction ID value.
   * @returns {string} The transaction ID value
   */
  get value(): string {
    return this._value;
  }

  /**
   * Converts to string representation.
   * @returns {string} The transaction ID value
   */
  toString(): string {
    return this._value;
  }
}
