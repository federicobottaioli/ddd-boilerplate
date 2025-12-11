import { Payment } from '../../domain/entities/payment';
import { RefundPaymentResponseDto } from '../dto/refund-payment.response.dto';

/**
 * Mapper for refund payment use case
 * Maps domain entity to response DTO
 */
export class RefundPaymentMapper {
    /**
     * Map domain entity to response DTO
     */
    static toResponse(payment: Payment): RefundPaymentResponseDto {
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
