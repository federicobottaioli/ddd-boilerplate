/**
 * Constants for Payment domain
 */
export const VALID_SORT_FIELDS = ['createdAt', 'updatedAt', 'amount', 'merchantReference'] as const;

export const MIN_AMOUNT = 0.01;
export const MAX_AMOUNT = 999999.99;
export const MIN_CARD_TOKEN_LENGTH = 10;
export const MAX_CARD_TOKEN_LENGTH = 100;
export const MIN_MERCHANT_REFERENCE_LENGTH = 3;
export const MAX_MERCHANT_REFERENCE_LENGTH = 100;
export const CURRENCY_CODE_LENGTH = 3; // ISO 4217 currency codes (e.g., USD, EUR)
