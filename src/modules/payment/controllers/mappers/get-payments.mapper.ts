import { GetPaymentsResponseDto } from '../dto/get-payments.response.dto';
import { GetPaymentByIdResponseDto } from '../dto/get-payment-by-id.response.dto';
import { GetPaymentByIdMapper } from './get-payment-by-id.mapper';
import { Payment } from '../../domain/entities/payment';

/**
 * Mapper for get payments use case
 * Maps domain entities to paginated response DTO
 */
export class GetPaymentsMapper {
    /**
     * Map domain entities to paginated response DTO
     */
    static toResponse(payments: Payment[], page: number, limit: number, total: number): GetPaymentsResponseDto {
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrevious = page > 1;

        const data: GetPaymentByIdResponseDto[] = payments.map((payment) => GetPaymentByIdMapper.toResponse(payment));

        return new GetPaymentsResponseDto(data, page, limit, total, totalPages, hasNext, hasPrevious);
    }
}
