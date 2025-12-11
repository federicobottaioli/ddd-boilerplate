/**
 * Error codes for domain exceptions.
 * These codes identify the type of error that occurred.
 */
enum ErrorCode {
    NOT_FOUND = 'NOT_FOUND',
    CONFLICT = 'CONFLICT',
    VALIDATION_ERROR = 'VALIDATION_ERROR',
    INTERNAL_ERROR = 'INTERNAL_ERROR',
    UNAUTHORIZED = 'UNAUTHORIZED',
    FORBIDDEN = 'FORBIDDEN',
    BAD_REQUEST = 'BAD_REQUEST',
    PAYMENT_ERROR = 'PAYMENT_ERROR',
}

export default ErrorCode;
