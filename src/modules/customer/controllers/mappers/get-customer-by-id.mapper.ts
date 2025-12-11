import { Customer } from '../../domain/entities/customer';
import { GetCustomerByIdResponseDto } from '../dto/get-customer-by-id.response.dto';

/**
 * Mapper for get customer by ID use case
 * Maps domain entity to response DTO
 */
export class GetCustomerByIdMapper {
    /**
     * Map domain entity to response DTO
     */
    static toResponse(customer: Customer): GetCustomerByIdResponseDto {
        return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt,
        };
    }
}
