import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Customer } from '../../../domain/entities/customer';
import { CustomerRepository } from '../../../domain/repositories/customer.repository';
import { CustomerEntity } from '../../entities/customer.orm-entity';
import { CustomerMapper } from '../../mappers/customer.mapper';
import { VALID_SORT_FIELDS } from '../../../domain/constants/customer.constants';
import { CreateCustomerData } from '../../../domain/types/customer.types';
import { EntityNotFoundException } from '@modules/shared/domain/exceptions';

/**
 * TypeORM implementation of the Customer repository interface.
 * Provides concrete data access operations for Customer entities.
 */
@Injectable()
export class CustomerRepositoryImpl implements CustomerRepository {
    constructor(
        @InjectRepository(CustomerEntity)
        private readonly customerTypeOrmRepository: Repository<CustomerEntity>,
    ) {}

    async findById(id: string): Promise<Customer | null> {
        const entity = await this.customerTypeOrmRepository.findOne({
            where: { id },
        });

        return entity ? CustomerMapper.toDomain(entity) : null;
    }

    async create(customer: CreateCustomerData): Promise<Customer> {
        const newEntity = this.customerTypeOrmRepository.create(customer);
        const savedEntity = await this.customerTypeOrmRepository.save(newEntity);
        return CustomerMapper.toDomain(savedEntity);
    }

    async update(id: string, updates: Partial<Customer>): Promise<Customer> {
        const entityUpdates = CustomerMapper.toEntityUpdate(updates);
        await this.customerTypeOrmRepository.update(id, entityUpdates);
        const updatedCustomer = await this.findById(id);
        if (!updatedCustomer) {
            throw new EntityNotFoundException('Customer', id);
        }
        return updatedCustomer;
    }

    async delete(id: string): Promise<void> {
        const result = await this.customerTypeOrmRepository.softDelete(id);
        if (result.affected === 0) {
            throw new EntityNotFoundException('Customer', id);
        }
    }

    async findWithPagination(
        page: number,
        limit: number,
        name?: string,
        email?: string,
        sortBy: string = 'createdAt',
        sortOrder: 'ASC' | 'DESC' = 'DESC',
    ): Promise<{ customers: Customer[]; total: number }> {
        const queryBuilder = this.customerTypeOrmRepository.createQueryBuilder('customer');

        // Apply filters
        if (name) {
            queryBuilder.where('customer.name ILIKE :name', { name: `%${name}%` });
        }
        if (email) {
            if (name) {
                queryBuilder.andWhere('customer.email ILIKE :email', { email: `%${email}%` });
            } else {
                queryBuilder.where('customer.email ILIKE :email', { email: `%${email}%` });
            }
        }

        // Get total count
        const total = await queryBuilder.getCount();

        // Apply sorting
        const validSortBy = VALID_SORT_FIELDS.includes(sortBy as any) ? sortBy : 'createdAt';
        queryBuilder.orderBy(`customer.${validSortBy}`, sortOrder);

        // Apply pagination
        const skip = (page - 1) * limit;
        queryBuilder.skip(skip).take(limit);

        // Get paginated results
        const entities = await queryBuilder.getMany();

        return {
            customers: entities.map((entity) => CustomerMapper.toDomain(entity)),
            total,
        };
    }
}
