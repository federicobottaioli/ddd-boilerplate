import { Payment } from '../../domain/entities/payment';
import { ProcessPaymentResponseDto } from '../dto/process-payment.response.dto';

/**
 * Mapper for process payment use case
 * Maps domain entity to response DTO
 */
export class ProcessPaymentMapper {
    /**
     * Map domain entity to response DTO
     */
    static toResponse(payment: Payment): ProcessPaymentResponseDto {
        return {
            id: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            merchantReference: payment.merchantReference,
            paymentStatusId: payment.paymentStatusId,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
        };
    }
}
