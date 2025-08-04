/**
 * Amount Value Object.
 * Represents a monetary amount in cents to avoid floating point precision issues.
 * Immutable and encapsulates basic monetary business rules.
 */
export class Amount {
  private constructor(private readonly _value: number) {}

  /**
   * Factory method to create an Amount from cents.
   * @param {number} cents - The amount in cents (must be integer)
   * @returns {Amount} A new Amount instance
   * @throws {Error} If amount is invalid
   */
  static create(cents: number): Amount {
    if (!Number.isInteger(cents)) {
      throw new Error('Amount must be an integer (in cents)');
    }

    if (cents < 0) {
      throw new Error('Amount cannot be negative');
    }

    // 9.99 million USD in cents
    if (cents > 999999999) {
      throw new Error('Amount exceeds maximum allowed value');
    }

    return new Amount(cents);
  }

  /**
   * Factory method to create an Amount from decimal value (12.50 becomes 1250 cents).
   * @param {number} decimal - The decimal amount
   * @returns {Amount} A new Amount instance
   */
  static createFromDecimal(decimal: number): Amount {
    if (decimal < 0) {
      throw new Error('Amount cannot be negative');
    }

    // Converts to cents and rounds to handle floating point precision
    const cents = Math.round(decimal * 100);

    return Amount.create(cents);
  }

  /**
   * Gets the amount value in cents.
   * @returns {number} The amount in cents
   */
  get valueCents(): number {
    return this._value;
  }

  /**
   * Gets the amount as decimal (1250 cents becomes 12.50).
   * @returns {number} The amount as decimal
   */
  get valueDecimal(): number {
    return this._value / 100;
  }

  /**
   * Formats the amount as currency string ("12.50").
   * @returns {string} Formatted currency string
   */
  toFormattedString(): string {
    return this.valueDecimal.toFixed(2);
  }

  /**
   * Converts to string representation.
   * @returns {string} String representation of amount in cents
   */
  toString(): string {
    return this._value.toString();
  }
}
