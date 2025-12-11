import { PaymentStatus } from '../../domain/entities/payment-status';
import { PaymentStatusEntity } from '../entities/payment-status.orm-entity';

/**
 * Mapper for converting between domain PaymentStatus and infrastructure PaymentStatusEntity
 */
export class PaymentStatusMapper {
    /**
     * Convert infrastructure entity to domain entity
     */
    static toDomain(entity: PaymentStatusEntity): PaymentStatus {
        return new PaymentStatus(
            entity.id,
            entity.name,
            entity.description || '',
            entity.createdAt,
            entity.updatedAt,
            entity.deletedAt,
        );
    }

    /**
     * Convert domain entity to infrastructure entity
     */
    static toEntity(domain: PaymentStatus): PaymentStatusEntity {
        const entity = new PaymentStatusEntity();
        entity.id = domain.id;
        entity.name = domain.name;
        entity.description = domain.description;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        entity.deletedAt = domain.deletedAt;
        return entity;
    }

    /**
     * Convert partial domain data to entity update data
     */
    static toEntityUpdate(domain: Partial<PaymentStatus>): Partial<PaymentStatusEntity> {
        const update: Partial<PaymentStatusEntity> = {};

        if (domain.name !== undefined) update.name = domain.name;
        if (domain.description !== undefined) update.description = domain.description;
        if (domain.updatedAt !== undefined) update.updatedAt = domain.updatedAt;

        return update;
    }
}
