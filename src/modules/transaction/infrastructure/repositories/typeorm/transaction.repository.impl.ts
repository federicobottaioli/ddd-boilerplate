import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Transaction } from '../../../domain/entities/transaction';
import { TransactionRepository } from '../../../domain/repositories/transaction.repository';
import { TransactionEntity } from '../../entities/transaction.orm-entity';
import { TransactionMapper } from '../../mappers/transaction.mapper';
import { CreateTransactionData } from '../../../domain/types/transaction.types';

/**
 * TypeORM implementation of the Transaction repository interface.
 * Provides concrete data access operations for Transaction entities.
 */
@Injectable()
export class TransactionRepositoryImpl implements TransactionRepository {
    constructor(
        @InjectRepository(TransactionEntity)
        private readonly transactionTypeOrmRepository: Repository<TransactionEntity>,
    ) {}

    async findById(id: string): Promise<Transaction | null> {
        const entity = await this.transactionTypeOrmRepository.findOne({
            where: { id },
        });

        return entity ? TransactionMapper.toDomain(entity) : null;
    }

    async findByPaymentId(paymentId: string): Promise<Transaction[]> {
        const entities = await this.transactionTypeOrmRepository.find({
            where: { paymentId },
            order: { createdAt: 'ASC' },
        });

        return entities.map((entity) => TransactionMapper.toDomain(entity));
    }

    async create(transaction: CreateTransactionData): Promise<Transaction> {
        const newEntity = this.transactionTypeOrmRepository.create(transaction);
        const savedEntity = await this.transactionTypeOrmRepository.save(newEntity);
        return TransactionMapper.toDomain(savedEntity);
    }

    async update(id: string, updates: Partial<Transaction>): Promise<Transaction> {
        const entityUpdates = TransactionMapper.toEntityUpdate(updates);
        await this.transactionTypeOrmRepository.update(id, entityUpdates);
        const updatedTransaction = await this.findById(id);
        if (!updatedTransaction) {
            throw new Error(`Transaction with id ${id} not found after update`);
        }
        return updatedTransaction;
    }
}
