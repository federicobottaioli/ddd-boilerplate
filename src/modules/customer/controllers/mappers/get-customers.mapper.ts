import { GetCustomersResponseDto } from '../dto/get-customers.response.dto';
import { GetCustomerByIdResponseDto } from '../dto/get-customer-by-id.response.dto';
import { GetCustomerByIdMapper } from './get-customer-by-id.mapper';
import { Customer } from '../../domain/entities/customer';

/**
 * Mapper for get customers use case
 * Maps domain entities to paginated response DTO
 */
export class GetCustomersMapper {
    /**
     * Map domain entities to paginated response DTO
     */
    static toResponse(customers: Customer[], page: number, limit: number, total: number): GetCustomersResponseDto {
        const totalPages = Math.ceil(total / limit);
        const hasNext = page < totalPages;
        const hasPrevious = page > 1;

        const data: GetCustomerByIdResponseDto[] = customers.map((customer) =>
            GetCustomerByIdMapper.toResponse(customer),
        );

        return new GetCustomersResponseDto(data, page, limit, total, totalPages, hasNext, hasPrevious);
    }
}
