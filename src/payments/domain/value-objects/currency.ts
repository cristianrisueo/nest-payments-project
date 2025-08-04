/**
 * Currency Value Object.
 * Represents a currency using ISO 4217 codes with validation.
 * Immutable and encapsulates currency business rules.
 */
export class Currency {
  private constructor(private readonly _code: string) {}

  /**
   * Supported currency codes.
   */
  private static readonly SUPPORTED_CURRENCIES = new Set(['USD', 'EUR', 'GBP']);

  /**
   * Factory method to create a Currency from ISO code.
   * @param {string} code - The currency code (only 3 allowed)
   * @returns {Currency} A new Currency instance
   * @throws {Error} If currency code is invalid
   */
  static create(code: string): Currency {
    if (!code || typeof code !== 'string') {
      throw new Error('Currency code is required and must be a string');
    }

    const normalizedCode = code.trim().toUpperCase();

    if (normalizedCode.length !== 3) {
      throw new Error('Currency code must be exactly 3 characters');
    }

    if (!this.SUPPORTED_CURRENCIES.has(normalizedCode)) {
      throw new Error(`Unsupported currency code: ${normalizedCode}`);
    }

    return new Currency(normalizedCode);
  }

  /**
   * Gets the currency code.
   * @returns {string} The ISO 4217 currency code
   */
  get code(): string {
    return this._code;
  }

  /**
   * Converts to string representation.
   * @returns {string} The currency code
   */
  toString(): string {
    return this._code;
  }
}
