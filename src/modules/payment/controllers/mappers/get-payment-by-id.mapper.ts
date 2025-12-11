import { Payment } from '../../domain/entities/payment';
import { GetPaymentByIdResponseDto } from '../dto/get-payment-by-id.response.dto';

/**
 * Mapper for get payment by ID use case
 * Maps domain entity to response DTO
 */
export class GetPaymentByIdMapper {
    /**
     * Map domain entity to response DTO
     */
    static toResponse(payment: Payment): GetPaymentByIdResponseDto {
        return {
            id: payment.id,
            amount: payment.amount,
            currency: payment.currency,
            merchantReference: payment.merchantReference,
            customerId: payment.customerId,
            paymentStatusId: payment.paymentStatusId,
            metadata: payment.metadata,
            createdAt: payment.createdAt,
            updatedAt: payment.updatedAt,
        };
    }
}
