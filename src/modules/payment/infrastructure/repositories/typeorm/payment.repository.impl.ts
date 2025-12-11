import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from '../../../domain/entities/payment';
import { PaymentRepository } from '../../../domain/repositories/payment.repository';
import { PaymentEntity } from '../../entities/payment.orm-entity';
import { PaymentMapper } from '../../mappers/payment.mapper';
import { VALID_SORT_FIELDS } from '../../../domain/constants/payment.constants';
import { CreatePaymentData, PaymentFilters } from '../../../domain/types/payment.types';

/**
 * TypeORM implementation of the Payment repository interface.
 * Provides concrete data access operations for Payment entities.
 */
@Injectable()
export class PaymentRepositoryImpl implements PaymentRepository {
    constructor(
        @InjectRepository(PaymentEntity)
        private readonly paymentTypeOrmRepository: Repository<PaymentEntity>,
    ) {}

    async findById(id: string, withRelations: boolean = false): Promise<Payment | null> {
        const queryBuilder = this.paymentTypeOrmRepository
            .createQueryBuilder('payment')
            .where('payment.id = :id', { id });

        if (withRelations) {
            queryBuilder
                .leftJoinAndSelect('payment.customer', 'customer')
                .leftJoinAndSelect('payment.paymentStatus', 'paymentStatus')
                .leftJoinAndSelect('payment.transactions', 'transactions');
        }

        const entity = await queryBuilder.getOne();

        return entity ? PaymentMapper.toDomain(entity) : null;
    }

    async create(payment: CreatePaymentData): Promise<Payment> {
        const newEntity = this.paymentTypeOrmRepository.create(payment);
        const savedEntity = await this.paymentTypeOrmRepository.save(newEntity);
        return PaymentMapper.toDomain(savedEntity);
    }

    async update(id: string, updates: Partial<Payment>): Promise<Payment> {
        const entityUpdates = PaymentMapper.toEntityUpdate(updates);
        // TypeORM's update method requires specific typing for JSONB fields
        await this.paymentTypeOrmRepository.update(id, entityUpdates as any);
        const updatedPayment = await this.findById(id);
        if (!updatedPayment) {
            throw new NotFoundException(`Payment with id ${id} not found after update`);
        }
        return updatedPayment;
    }

    async delete(id: string): Promise<void> {
        const result = await this.paymentTypeOrmRepository.softDelete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Payment with id ${id} not found`);
        }
    }

    async findWithPagination(
        page: number,
        limit: number,
        filters: PaymentFilters,
        sortBy: string = 'createdAt',
        sortOrder: 'ASC' | 'DESC' = 'DESC',
    ): Promise<{ payments: Payment[]; total: number }> {
        const queryBuilder = this.paymentTypeOrmRepository.createQueryBuilder('payment');

        // Always join relations for filtering
        queryBuilder
            .leftJoinAndSelect('payment.customer', 'customer')
            .leftJoinAndSelect('payment.paymentStatus', 'paymentStatus');

        // Apply filters
        const conditions: string[] = [];
        const parameters: Record<string, unknown> = {};

        if (filters.customerId) {
            conditions.push('payment.customerId = :customerId');
            parameters.customerId = filters.customerId;
        }

        if (filters.paymentStatusId) {
            conditions.push('payment.paymentStatusId = :paymentStatusId');
            parameters.paymentStatusId = filters.paymentStatusId;
        }

        if (filters.merchantReference) {
            conditions.push('payment.merchantReference ILIKE :merchantReference');
            parameters.merchantReference = `%${filters.merchantReference}%`;
        }

        if (filters.minAmount !== undefined) {
            conditions.push('payment.amount >= :minAmount');
            parameters.minAmount = filters.minAmount;
        }

        if (filters.maxAmount !== undefined) {
            conditions.push('payment.amount <= :maxAmount');
            parameters.maxAmount = filters.maxAmount;
        }

        if (filters.currency) {
            conditions.push('payment.currency = :currency');
            parameters.currency = filters.currency;
        }

        if (conditions.length > 0) {
            const whereCondition = conditions.join(' AND ');
            queryBuilder.where(whereCondition, parameters);
        }

        // Get total count
        const total = await queryBuilder.getCount();

        // Apply sorting
        const validSortBy = VALID_SORT_FIELDS.includes(sortBy as any) ? sortBy : 'createdAt';
        queryBuilder.orderBy(`payment.${validSortBy}`, sortOrder);

        // Apply pagination
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);

        // Get paginated results
        const entities = await queryBuilder.getMany();

        return {
            payments: entities.map((entity) => PaymentMapper.toDomain(entity)),
            total,
        };
    }
}
