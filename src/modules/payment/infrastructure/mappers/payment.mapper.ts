import { Payment } from '../../domain/entities/payment';
import { PaymentEntity } from '../entities/payment.orm-entity';

/**
 * Mapper for converting between domain Payment and infrastructure PaymentEntity
 */
export class PaymentMapper {
    /**
     * Convert infrastructure entity to domain entity
     */
    static toDomain(entity: PaymentEntity): Payment {
        return new Payment(
            entity.id,
            Number(entity.amount),
            entity.currency,
            entity.cardToken,
            entity.merchantReference,
            entity.customerId,
            entity.paymentStatusId,
            entity.metadata || {},
            entity.createdAt,
            entity.updatedAt,
            entity.deletedAt,
        );
    }

    /**
     * Convert domain entity to infrastructure entity
     */
    static toEntity(domain: Payment): PaymentEntity {
        const entity = new PaymentEntity();
        entity.id = domain.id;
        entity.amount = domain.amount;
        entity.currency = domain.currency;
        entity.cardToken = domain.cardToken;
        entity.merchantReference = domain.merchantReference;
        entity.customerId = domain.customerId;
        entity.paymentStatusId = domain.paymentStatusId;
        entity.metadata = domain.metadata;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        entity.deletedAt = domain.deletedAt;
        return entity;
    }

    /**
     * Convert partial domain data to entity update data
     */
    static toEntityUpdate(domain: Partial<Payment>): Partial<PaymentEntity> {
        const update: Partial<PaymentEntity> = {};

        if (domain.amount !== undefined) update.amount = domain.amount;
        if (domain.currency !== undefined) update.currency = domain.currency;
        if (domain.cardToken !== undefined) update.cardToken = domain.cardToken;
        if (domain.merchantReference !== undefined) update.merchantReference = domain.merchantReference;
        if (domain.customerId !== undefined) update.customerId = domain.customerId;
        if (domain.paymentStatusId !== undefined) update.paymentStatusId = domain.paymentStatusId;
        if (domain.metadata !== undefined) update.metadata = domain.metadata;
        if (domain.updatedAt !== undefined) update.updatedAt = domain.updatedAt;

        return update;
    }
}
