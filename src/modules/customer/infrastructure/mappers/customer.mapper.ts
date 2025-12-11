import { Customer } from '../../domain/entities/customer';
import { CustomerEntity } from '../entities/customer.orm-entity';

/**
 * Mapper for converting between domain Customer and infrastructure CustomerEntity
 */
export class CustomerMapper {
    /**
     * Convert infrastructure entity to domain entity
     */
    static toDomain(entity: CustomerEntity): Customer {
        return new Customer(
            entity.id,
            entity.name,
            entity.email,
            entity.createdAt,
            entity.updatedAt,
            entity.deletedAt,
        );
    }

    /**
     * Convert domain entity to infrastructure entity
     */
    static toEntity(domain: Customer): CustomerEntity {
        const entity = new CustomerEntity();
        entity.id = domain.id;
        entity.name = domain.name;
        entity.email = domain.email;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        entity.deletedAt = domain.deletedAt;
        return entity;
    }

    /**
     * Convert partial domain data to entity update data
     */
    static toEntityUpdate(domain: Partial<Customer>): Partial<CustomerEntity> {
        const update: Partial<CustomerEntity> = {};

        if (domain.name !== undefined) update.name = domain.name;
        if (domain.email !== undefined) update.email = domain.email;
        if (domain.updatedAt !== undefined) update.updatedAt = domain.updatedAt;

        return update;
    }
}
