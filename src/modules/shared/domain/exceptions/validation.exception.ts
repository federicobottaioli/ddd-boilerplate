import { DomainException } from './domain.exception';
import ErrorCode from '../constants/error-codes';

/**
 * Exception thrown when business validation fails.
 */
export class ValidationException extends DomainException {
    readonly code = ErrorCode.VALIDATION_ERROR;
    readonly details?: Record<string, unknown>;

    constructor(message: string, details?: Record<string, unknown>, cause?: unknown) {
        super(message, cause);
        this.details = details;
    }
}
