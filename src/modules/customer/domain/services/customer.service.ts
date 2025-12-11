import { Inject, Injectable } from '@nestjs/common';
import { Customer } from '../entities/customer';
import { CustomerRepository } from '../repositories/customer.repository';
import { MIN_NAME_LENGTH, MAX_NAME_LENGTH, MAX_EMAIL_LENGTH } from '../constants/customer.constants';
import { APP_LOGGER_TOKEN, type IAppLogger } from '@modules/shared/application/interfaces/app-logger';
import { EntityNotFoundException, ValidationException } from '@modules/shared/domain/exceptions';
import { CreateCustomerData } from '../types/customer.types';

/**
 * Domain service for Customer business logic operations.
 * Contains all business rules and operations related to customers.
 */
@Injectable()
export class CustomerService {
    constructor(
        @Inject('CustomerRepository')
        private readonly customerRepository: CustomerRepository,
        @Inject(APP_LOGGER_TOKEN)
        private readonly logger: IAppLogger,
    ) {}

    /**
     * Validate email format
     */
    private validateEmail(email: string): void {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            this.logger.warn(`[CustomerService] Invalid email format: ${email}`);
            throw new ValidationException('Invalid email format');
        }
    }

    /**
     * Create a new customer
     */
    async createCustomer(data: CreateCustomerData): Promise<Customer> {
        this.logger.log(`[CustomerService] Creating customer with email: ${data.email}`);

        // Trim and validate name
        const trimmedName = data.name.trim();
        if (!trimmedName || trimmedName.length < MIN_NAME_LENGTH) {
            this.logger.warn('[CustomerService] Customer creation failed: invalid name');
            throw new ValidationException('Customer name cannot be empty and must be at least 2 characters');
        }
        if (trimmedName.length > MAX_NAME_LENGTH) {
            this.logger.warn('[CustomerService] Customer creation failed: name too long');
            throw new ValidationException(`Customer name must not exceed ${MAX_NAME_LENGTH} characters`);
        }

        // Trim and validate email
        const trimmedEmail = data.email.trim().toLowerCase();
        if (!trimmedEmail || trimmedEmail.length > MAX_EMAIL_LENGTH) {
            this.logger.warn('[CustomerService] Customer creation failed: invalid email');
            throw new ValidationException(`Email must not exceed ${MAX_EMAIL_LENGTH} characters`);
        }
        this.validateEmail(trimmedEmail);

        const customerToCreate = {
            name: trimmedName,
            email: trimmedEmail,
        };

        const customer = await this.customerRepository.create(customerToCreate);
        this.logger.log(`[CustomerService] Customer created successfully with id: ${customer.id}`);

        return customer;
    }

    /**
     * Get customer by ID
     */
    async getCustomerById(id: string): Promise<Customer> {
        this.logger.log(`[CustomerService] Getting customer by id: ${id}`);

        const customer = await this.customerRepository.findById(id);
        if (!customer) {
            this.logger.warn(`[CustomerService] Customer not found with id: ${id}`);
            throw new EntityNotFoundException('Customer', id);
        }

        this.logger.log(`[CustomerService] Customer found: ${customer.name}`);
        return customer;
    }

    /**
     * Get customers with pagination and optional filters
     */
    async getCustomersWithPagination(
        page: number,
        limit: number,
        name?: string,
        email?: string,
        sortBy?: string,
        sortOrder?: 'ASC' | 'DESC',
    ): Promise<{ customers: Customer[]; total: number }> {
        this.logger.log(`[CustomerService] Getting customers with pagination - page: ${page}, limit: ${limit}`);

        const result = await this.customerRepository.findWithPagination(
            page,
            limit,
            name,
            email,
            sortBy,
            sortOrder,
        );

        this.logger.log(`[CustomerService] Found ${result.total} customers`);

        return result;
    }

    /**
     * Update customer information
     */
    async updateCustomer(id: string, data: Partial<CreateCustomerData>): Promise<Customer> {
        this.logger.log(`[CustomerService] Updating customer with id: ${id}`);

        // Validate customer exists
        await this.getCustomerById(id);

        // Prepare updates
        const updateData: Partial<Customer> = {};

        if (data.name !== undefined) {
            const trimmedName = data.name.trim();
            if (!trimmedName || trimmedName.length < MIN_NAME_LENGTH) {
                this.logger.warn('[CustomerService] Customer update failed: invalid name');
                throw new ValidationException('Customer name cannot be empty and must be at least 2 characters');
            }
            if (trimmedName.length > MAX_NAME_LENGTH) {
                this.logger.warn('[CustomerService] Customer update failed: name too long');
                throw new ValidationException(`Customer name must not exceed ${MAX_NAME_LENGTH} characters`);
            }
            updateData.name = trimmedName;
        }

        if (data.email !== undefined) {
            const trimmedEmail = data.email.trim().toLowerCase();
            if (!trimmedEmail || trimmedEmail.length > MAX_EMAIL_LENGTH) {
                this.logger.warn('[CustomerService] Customer update failed: invalid email');
                throw new ValidationException(`Email must not exceed ${MAX_EMAIL_LENGTH} characters`);
            }
            this.validateEmail(trimmedEmail);
            updateData.email = trimmedEmail;
        }

        const customer = await this.customerRepository.update(id, updateData);
        this.logger.log(`[CustomerService] Customer updated successfully: ${customer.name}`);

        return customer;
    }

    /**
     * Delete customer
     */
    async deleteCustomer(id: string): Promise<void> {
        this.logger.log(`[CustomerService] Deleting customer with id: ${id}`);

        // Validate customer exists
        const customer = await this.getCustomerById(id);

        await this.customerRepository.delete(id);
        this.logger.log(`[CustomerService] Customer deleted successfully: ${customer.name}`);
    }
}
