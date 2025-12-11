import { PaymentStatus } from '../../domain/entities/payment-status';
import { GetPaymentStatusByIdResponseDto } from '../dto/get-payment-status-by-id.response.dto';

/**
 * Mapper for get payment status by ID use case
 * Maps domain entity to response DTO
 */
export class GetPaymentStatusByIdMapper {
    /**
     * Map domain entity to response DTO
     */
    static toResponse(paymentStatus: PaymentStatus): GetPaymentStatusByIdResponseDto {
        return {
            id: paymentStatus.id,
            name: paymentStatus.name,
            description: paymentStatus.description,
            createdAt: paymentStatus.createdAt,
            updatedAt: paymentStatus.updatedAt,
        };
    }
}
