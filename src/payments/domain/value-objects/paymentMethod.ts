/**
 * PaymentMethod Value Object.
 * Represents a payment method with type and basic details.
 * Immutable and encapsulates payment method business rules.
 */
export class PaymentMethod {
  private constructor(
    private readonly _type: string,
    private readonly _lastFourDigits: string,
  ) {}

  /**
   * Supported payment method types.
   */
  private static readonly SUPPORTED_TYPES = new Set([
    'CREDIT_CARD',
    'DEBIT_CARD',
  ]);

  /**
   * Factory method to create a PaymentMethod.
   * @param {string} type - The payment method type ('CREDIT_CARD' or 'DEBIT_CARD')
   * @param {string} lastFourDigits - Last 4 digits of the card
   * @returns {PaymentMethod} A new PaymentMethod instance
   * @throws {Error} If payment method data is invalid
   */
  static create(type: string, lastFourDigits: string): PaymentMethod {
    if (!type || typeof type !== 'string') {
      throw new Error('Payment method type is required and must be a string');
    }

    const normalizedType = type.trim().toUpperCase();

    if (!this.SUPPORTED_TYPES.has(normalizedType)) {
      throw new Error(`Unsupported payment method type: ${normalizedType}`);
    }

    if (!lastFourDigits || typeof lastFourDigits !== 'string') {
      throw new Error('Last four digits are required and must be a string');
    }

    const trimmedDigits = lastFourDigits.trim();

    if (!/^\d{4}$/.test(trimmedDigits)) {
      throw new Error('Last four digits must be exactly 4 numeric digits');
    }

    return new PaymentMethod(normalizedType, trimmedDigits);
  }

  /**
   * Gets the payment method type.
   * @returns {string} The payment method type
   */
  get type(): string {
    return this._type;
  }

  /**
   * Gets the last four digits.
   * @returns {string} The last four digits
   */
  get lastFourDigits(): string {
    return this._lastFourDigits;
  }

  /**
   * Converts to string representation.
   * @returns {string} Human-readable payment method and last four digits
   */
  toString(): string {
    const typeDisplay =
      this._type === 'CREDIT_CARD' ? 'Credit Card' : 'Debit Card';

    return `${typeDisplay} ****${this._lastFourDigits}`;
  }
}
