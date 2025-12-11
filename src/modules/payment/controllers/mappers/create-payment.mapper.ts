import { Payment } from '../../domain/entities/payment';
import { CreatePaymentResponseDto } from '../dto/create-payment.response.dto';

/**
 * Mapper for create payment use case
 * Maps domain entity to response DTO
 */
export class CreatePaymentMapper {
    /**
     * Map domain entity to response DTO
     */
    static toResponse(payment: Payment): CreatePaymentResponseDto {
        return {
            id: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            merchantReference: payment.merchantReference,
            customerId: payment.customerId,
            paymentStatusId: payment.paymentStatusId,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
        };
    }
}
