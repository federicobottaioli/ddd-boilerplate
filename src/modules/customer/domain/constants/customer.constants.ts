/**
 * Constants for Customer domain
 */
export const VALID_SORT_FIELDS = ['createdAt', 'updatedAt', 'name', 'email'] as const;

export const MIN_NAME_LENGTH = 2;
export const MAX_NAME_LENGTH = 200;
export const MAX_EMAIL_LENGTH = 255;
