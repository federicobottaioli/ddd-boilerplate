import { Customer } from '../../domain/entities/customer';
import { CreateCustomerResponseDto } from '../dto/create-customer.response.dto';

/**
 * Mapper for create customer use case
 * Maps domain entity to response DTO
 */
export class CreateCustomerMapper {
    /**
     * Map domain entity to response DTO
     */
    static toResponse(customer: Customer): CreateCustomerResponseDto {
        return {
            id: customer.id,
            name: customer.name,
            email: customer.email,
            createdAt: customer.createdAt,
            updatedAt: customer.updatedAt,
        };
    }
}
