import { GetPaymentStatusResponseDto } from '../dto/get-payment-status.response.dto';
import { GetPaymentStatusByIdResponseDto } from '../dto/get-payment-status-by-id.response.dto';
import { GetPaymentStatusByIdMapper } from './get-payment-status-by-id.mapper';
import { PaymentStatus } from '../../domain/entities/payment-status';

/**
 * Mapper for get payment statuses use case
 * Maps domain entities to paginated response DTO
 */
export class GetPaymentStatusMapper {
    /**
     * Map domain entities to paginated response DTO
     */
    static toResponse(
        paymentStatuses: PaymentStatus[],
        page: number,
        limit: number,
        total: number,
    ): GetPaymentStatusResponseDto {
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrevious = page > 1;

        const data: GetPaymentStatusByIdResponseDto[] = paymentStatuses.map((status) =>
            GetPaymentStatusByIdMapper.toResponse(status),
        );

        return new GetPaymentStatusResponseDto(data, page, limit, total, totalPages, hasNext, hasPrevious);
    }
}
