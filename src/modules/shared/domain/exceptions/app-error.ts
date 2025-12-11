/**
 * Base abstract class for all application errors.
 * Provides a common structure for error handling across the application.
 */
export abstract class AppError extends Error {
    abstract readonly code: string;
    readonly cause?: unknown;

    constructor(message: string, cause?: unknown) {
        super(message);
        this.cause = cause;
    }
}
