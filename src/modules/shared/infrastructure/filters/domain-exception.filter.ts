import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus, HttpException, Inject } from '@nestjs/common';
import { Response } from 'express';
import {
    DomainException,
    EntityNotFoundException,
    ValidationException,
    PaymentException,
} from '@modules/shared/domain/exceptions';
import { APP_LOGGER_TOKEN, type IAppLogger } from '@modules/shared/application/interfaces/app-logger';
import ErrorCode from '@modules/shared/domain/constants/error-codes';

/**
 * Global exception filter that catches domain exceptions and maps them to HTTP responses.
 * This centralizes error handling and removes the need for try-catch blocks in controllers.
 */
@Catch()
export class DomainExceptionFilter implements ExceptionFilter {
    constructor(
        @Inject(APP_LOGGER_TOKEN)
        private readonly logger: IAppLogger,
    ) {}

    catch(exception: unknown, host: ArgumentsHost): void {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        // If it's an HTTP exception (from NestJS guards, pipes, etc.), add error code
        if (exception instanceof HttpException) {
            const status = exception.getStatus();
            const exceptionResponse = exception.getResponse();
            const code = this.getErrorCodeFromStatus(status);

            const baseResponse =
                typeof exceptionResponse === 'string'
                    ? { statusCode: status, message: exceptionResponse, error: this.getErrorName(status) }
                    : (exceptionResponse as object);

            response.status(status).json({
                ...baseResponse,
                code,
            });
            return;
        }

        // Map domain exceptions to HTTP responses
        if (exception instanceof DomainException) {
            const { status, errorResponse } = this.mapDomainException(exception);

            this.logger.warn(`[DomainExceptionFilter] ${exception.constructor.name}: ${exception.message}`);

            response.status(status).json(errorResponse);
            return;
        }

        // Unknown error - log and return 500
        this.logger.error(
            `[DomainExceptionFilter] Unhandled exception: ${exception instanceof Error ? exception.message : 'Unknown error'}`,
            exception instanceof Error ? exception.stack : undefined,
        );

        response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
            statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
            message: 'Internal server error',
            code: ErrorCode.INTERNAL_ERROR,
        });
    }

    private mapDomainException(exception: DomainException): {
        status: HttpStatus;
        errorResponse: object;
    } {
        let status: HttpStatus;
        let message: string = exception.message;

        if (exception instanceof EntityNotFoundException) {
            status = HttpStatus.NOT_FOUND;
        } else if (exception instanceof ValidationException) {
            status = HttpStatus.BAD_REQUEST;
        } else if (exception instanceof PaymentException) {
            status = HttpStatus.BAD_REQUEST;
        } else {
            status = HttpStatus.INTERNAL_SERVER_ERROR;
            message = 'Internal server error';
        }

        return {
            status,
            errorResponse: {
                statusCode: status,
                message,
                error: this.getErrorName(status),
                code: exception.code,
            },
        };
    }

    private getErrorName(status: HttpStatus): string {
        switch (status) {
            case HttpStatus.NOT_FOUND:
                return 'Not Found';
            case HttpStatus.BAD_REQUEST:
                return 'Bad Request';
            case HttpStatus.CONFLICT:
                return 'Conflict';
            case HttpStatus.FORBIDDEN:
                return 'Forbidden';
            case HttpStatus.UNAUTHORIZED:
                return 'Unauthorized';
            case HttpStatus.INTERNAL_SERVER_ERROR:
                return 'Internal Server Error';
            default:
                return 'Error';
        }
    }

    private getErrorCodeFromStatus(status: HttpStatus): string {
        switch (status) {
            case HttpStatus.NOT_FOUND:
                return ErrorCode.NOT_FOUND;
            case HttpStatus.BAD_REQUEST:
                return ErrorCode.BAD_REQUEST;
            case HttpStatus.CONFLICT:
                return ErrorCode.CONFLICT;
            case HttpStatus.FORBIDDEN:
                return ErrorCode.FORBIDDEN;
            case HttpStatus.UNAUTHORIZED:
                return ErrorCode.UNAUTHORIZED;
            case HttpStatus.INTERNAL_SERVER_ERROR:
                return ErrorCode.INTERNAL_ERROR;
            default:
                return ErrorCode.INTERNAL_ERROR;
        }
    }
}
