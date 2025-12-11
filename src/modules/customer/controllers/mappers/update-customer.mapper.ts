import { Customer } from '../../domain/entities/customer';
import { UpdateCustomerResponseDto } from '../dto/update-customer.response.dto';

/**
 * Mapper for update customer use case
 * Maps domain entity to response DTO
 */
export class UpdateCustomerMapper {
    /**
     * Map domain entity to response DTO
     */
    static toResponse(customer: Customer): UpdateCustomerResponseDto {
        return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt,
        };
    }
}
