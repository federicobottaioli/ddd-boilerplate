import { AppError } from './app-error';

/**
 * Base exception for domain layer exceptions.
 * All domain exceptions should extend this class.
 */
export abstract class DomainException extends AppError {
    abstract readonly code: string;

    constructor(message: string, cause?: unknown) {
        super(message, cause);
    }
}
