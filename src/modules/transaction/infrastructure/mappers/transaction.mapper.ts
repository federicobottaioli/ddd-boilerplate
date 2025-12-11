import { Transaction } from '../../domain/entities/transaction';
import { TransactionEntity } from '../entities/transaction.orm-entity';

/**
 * Mapper for converting between domain Transaction and infrastructure TransactionEntity
 */
export class TransactionMapper {
    /**
     * Convert infrastructure entity to domain entity
     */
    static toDomain(entity: TransactionEntity): Transaction {
        return new Transaction(
            entity.id,
            entity.paymentId,
            entity.type,
            Number(entity.amount),
            entity.status,
            entity.gatewayResponse,
            entity.gatewayTransactionId,
            entity.createdAt,
            entity.updatedAt,
        );
    }

    /**
     * Convert domain entity to infrastructure entity
     */
    static toEntity(domain: Transaction): TransactionEntity {
        const entity = new TransactionEntity();
        entity.id = domain.id;
        entity.paymentId = domain.paymentId;
        entity.type = domain.type;
        entity.amount = domain.amount;
        entity.status = domain.status;
        entity.gatewayResponse = domain.gatewayResponse;
        entity.gatewayTransactionId = domain.gatewayTransactionId;
        entity.createdAt = domain.createdAt;
        entity.updatedAt = domain.updatedAt;
        return entity;
    }

    /**
     * Convert partial domain data to entity update data
     */
    static toEntityUpdate(domain: Partial<Transaction>): Partial<TransactionEntity> {
        const update: Partial<TransactionEntity> = {};

        if (domain.status !== undefined) update.status = domain.status;
        if (domain.gatewayResponse !== undefined) update.gatewayResponse = domain.gatewayResponse;
        if (domain.gatewayTransactionId !== undefined) update.gatewayTransactionId = domain.gatewayTransactionId;
        if (domain.updatedAt !== undefined) update.updatedAt = domain.updatedAt;

        return update;
    }
}
