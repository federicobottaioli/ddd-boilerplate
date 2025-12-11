import { PaymentStatus } from '../../domain/entities/payment-status';
import { CreatePaymentStatusResponseDto } from '../dto/create-payment-status.response.dto';

/**
 * Mapper for create payment status use case
 * Maps domain entity to response DTO
 */
export class CreatePaymentStatusMapper {
    /**
     * Map domain entity to response DTO
     */
    static toResponse(paymentStatus: PaymentStatus): CreatePaymentStatusResponseDto {
        return {
            id: paymentStatus.id,
            name: paymentStatus.name,
            description: paymentStatus.description,
            createdAt: paymentStatus.createdAt,
            updatedAt: paymentStatus.updatedAt,
        };
    }
}
