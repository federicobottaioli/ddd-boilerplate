import { DomainException } from './domain.exception';
import ErrorCode from '../constants/error-codes';

/**
 * Exception thrown when payment processing fails.
 */
export class PaymentException extends DomainException {
    readonly code = ErrorCode.VALIDATION_ERROR;
    readonly gatewayError?: string;
    readonly gatewayCode?: string;

    constructor(message: string, gatewayError?: string, gatewayCode?: string, cause?: unknown) {
        super(message, cause);
        this.gatewayError = gatewayError;
        this.gatewayCode = gatewayCode;
    }
}
