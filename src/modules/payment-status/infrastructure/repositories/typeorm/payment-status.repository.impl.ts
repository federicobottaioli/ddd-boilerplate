import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PaymentStatus } from '../../../domain/entities/payment-status';
import { PaymentStatusRepository } from '../../../domain/repositories/payment-status.repository';
import { PaymentStatusEntity } from '../../entities/payment-status.orm-entity';
import { PaymentStatusMapper } from '../../mappers/payment-status.mapper';
import { VALID_SORT_FIELDS } from '../../../domain/constants/payment-status.constants';
import { CreatePaymentStatusData } from '../../../domain/types/payment-status.types';
import { EntityNotFoundException } from '@modules/shared/domain/exceptions';

/**
 * TypeORM implementation of the PaymentStatus repository interface.
 * Provides concrete data access operations for PaymentStatus entities.
 */
@Injectable()
export class PaymentStatusRepositoryImpl implements PaymentStatusRepository {
    constructor(
        @InjectRepository(PaymentStatusEntity)
        private readonly paymentStatusTypeOrmRepository: Repository<PaymentStatusEntity>,
    ) {}

    async findById(id: string): Promise<PaymentStatus | null> {
        const entity = await this.paymentStatusTypeOrmRepository.findOne({
            where: { id },
        });

        return entity ? PaymentStatusMapper.toDomain(entity) : null;
    }

    async findByName(name: string): Promise<PaymentStatus | null> {
        const entity = await this.paymentStatusTypeOrmRepository.findOne({
            where: { name },
        });

        return entity ? PaymentStatusMapper.toDomain(entity) : null;
    }

    async create(paymentStatus: CreatePaymentStatusData): Promise<PaymentStatus> {
        const newEntity = this.paymentStatusTypeOrmRepository.create(paymentStatus);
        const savedEntity = await this.paymentStatusTypeOrmRepository.save(newEntity);
        return PaymentStatusMapper.toDomain(savedEntity);
    }

    async update(id: string, updates: Partial<PaymentStatus>): Promise<PaymentStatus> {
        const entityUpdates = PaymentStatusMapper.toEntityUpdate(updates);
        await this.paymentStatusTypeOrmRepository.update(id, entityUpdates);
        const updatedPaymentStatus = await this.findById(id);
        if (!updatedPaymentStatus) {
            throw new EntityNotFoundException('PaymentStatus', id);
        }
        return updatedPaymentStatus;
    }

    async delete(id: string): Promise<void> {
        const result = await this.paymentStatusTypeOrmRepository.softDelete(id);
        if (result.affected === 0) {
            throw new EntityNotFoundException('PaymentStatus', id);
        }
    }

    async findWithPagination(
        page: number,
        limit: number,
        name?: string,
        sortBy: string = 'createdAt',
        sortOrder: 'ASC' | 'DESC' = 'DESC',
    ): Promise<{ paymentStatuses: PaymentStatus[]; total: number }> {
        const queryBuilder = this.paymentStatusTypeOrmRepository.createQueryBuilder('paymentStatus');

        // Apply filters
        if (name) {
            queryBuilder.where('paymentStatus.name ILIKE :name', { name: `%${name}%` });
        }

        // Get total count
        const total = await queryBuilder.getCount();

        // Apply sorting
        const validSortBy = VALID_SORT_FIELDS.includes(sortBy as any) ? sortBy : 'createdAt';
        queryBuilder.orderBy(`paymentStatus.${validSortBy}`, sortOrder);

        // Apply pagination
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);

        // Get paginated results
        const entities = await queryBuilder.getMany();

        return {
            paymentStatuses: entities.map((entity) => PaymentStatusMapper.toDomain(entity)),
            total,
        };
    }
}
