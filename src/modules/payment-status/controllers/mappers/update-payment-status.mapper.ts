import { PaymentStatus } from '../../domain/entities/payment-status';
import { UpdatePaymentStatusResponseDto } from '../dto/update-payment-status.response.dto';

/**
 * Mapper for update payment status use case
 * Maps domain entity to response DTO
 */
export class UpdatePaymentStatusMapper {
    /**
     * Map domain entity to response DTO
     */
    static toResponse(paymentStatus: PaymentStatus): UpdatePaymentStatusResponseDto {
        return {
            id: paymentStatus.id,
            name: paymentStatus.name,
            description: paymentStatus.description,
            createdAt: paymentStatus.createdAt,
            updatedAt: paymentStatus.updatedAt,
        };
    }
}
