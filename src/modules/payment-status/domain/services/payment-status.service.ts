import { Inject, Injectable } from '@nestjs/common';
import { PaymentStatus } from '../entities/payment-status';
import { PaymentStatusRepository } from '../repositories/payment-status.repository';
import { MIN_NAME_LENGTH, MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH } from '../constants/payment-status.constants';
import { APP_LOGGER_TOKEN, type IAppLogger } from '@modules/shared/application/interfaces/app-logger';
import { EntityNotFoundException, ValidationException } from '@modules/shared/domain/exceptions';
import { CreatePaymentStatusData } from '../types/payment-status.types';

/**
 * Domain service for PaymentStatus business logic operations.
 * Contains all business rules and operations related to payment statuses.
 */
@Injectable()
export class PaymentStatusService {
    constructor(
        @Inject('PaymentStatusRepository')
        private readonly paymentStatusRepository: PaymentStatusRepository,
        @Inject(APP_LOGGER_TOKEN)
        private readonly logger: IAppLogger,
    ) {}

    /**
     * Create a new payment status
     */
    async createPaymentStatus(data: CreatePaymentStatusData): Promise<PaymentStatus> {
        this.logger.log(`[PaymentStatusService] Creating payment status with name: ${data.name}`);

        // Trim and validate name
        const trimmedName = data.name.trim();
        if (!trimmedName || trimmedName.length < MIN_NAME_LENGTH) {
            this.logger.warn('[PaymentStatusService] Payment status creation failed: invalid name');
            throw new ValidationException('Payment status name cannot be empty and must be at least 2 characters');
        }
        if (trimmedName.length > MAX_NAME_LENGTH) {
            this.logger.warn('[PaymentStatusService] Payment status creation failed: name too long');
            throw new ValidationException(`Payment status name must not exceed ${MAX_NAME_LENGTH} characters`);
        }

        // Check if name already exists
        const existing = await this.paymentStatusRepository.findByName(trimmedName);
        if (existing) {
            this.logger.warn(`[PaymentStatusService] Payment status creation failed: name already exists: ${trimmedName}`);
            throw new ValidationException(`Payment status with name '${trimmedName}' already exists`);
        }

        // Trim description if provided
        const trimmedDescription = data.description?.trim() || '';
        if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
            this.logger.warn('[PaymentStatusService] Payment status creation failed: description too long');
            throw new ValidationException(`Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`);
        }

        const paymentStatusToCreate = {
            name: trimmedName,
            description: trimmedDescription,
        };

        const paymentStatus = await this.paymentStatusRepository.create(paymentStatusToCreate);
        this.logger.log(
            `[PaymentStatusService] Payment status created successfully with id: ${paymentStatus.id}`,
        );

        return paymentStatus;
    }

    /**
     * Get payment status by ID
     */
    async getPaymentStatusById(id: string): Promise<PaymentStatus> {
        this.logger.log(`[PaymentStatusService] Getting payment status by id: ${id}`);

        const paymentStatus = await this.paymentStatusRepository.findById(id);
        if (!paymentStatus) {
            this.logger.warn(`[PaymentStatusService] Payment status not found with id: ${id}`);
            throw new EntityNotFoundException('PaymentStatus', id);
        }

        this.logger.log(`[PaymentStatusService] Payment status found: ${paymentStatus.name}`);
        return paymentStatus;
    }

    /**
     * Get payment statuses with pagination and optional filters
     */
    async getPaymentStatusesWithPagination(
        page: number,
        limit: number,
        name?: string,
        sortBy?: string,
        sortOrder?: 'ASC' | 'DESC',
    ): Promise<{ paymentStatuses: PaymentStatus[]; total: number }> {
        this.logger.log(
            `[PaymentStatusService] Getting payment statuses with pagination - page: ${page}, limit: ${limit}`,
        );

        const result = await this.paymentStatusRepository.findWithPagination(
            page,
            limit,
            name,
            sortBy,
            sortOrder,
        );

        this.logger.log(`[PaymentStatusService] Found ${result.total} payment statuses`);

        return result;
    }

    /**
     * Update payment status information
     */
    async updatePaymentStatus(id: string, data: Partial<CreatePaymentStatusData>): Promise<PaymentStatus> {
        this.logger.log(`[PaymentStatusService] Updating payment status with id: ${id}`);

        // Validate payment status exists
        await this.getPaymentStatusById(id);

        // Prepare updates
        const updateData: Partial<PaymentStatus> = {};

        if (data.name !== undefined) {
            const trimmedName = data.name.trim();
            if (!trimmedName || trimmedName.length < MIN_NAME_LENGTH) {
                this.logger.warn('[PaymentStatusService] Payment status update failed: invalid name');
                throw new ValidationException('Payment status name cannot be empty and must be at least 2 characters');
            }
            if (trimmedName.length > MAX_NAME_LENGTH) {
                this.logger.warn('[PaymentStatusService] Payment status update failed: name too long');
                throw new ValidationException(`Payment status name must not exceed ${MAX_NAME_LENGTH} characters`);
            }

            // Check if name already exists (excluding current record)
            const existing = await this.paymentStatusRepository.findByName(trimmedName);
            if (existing && existing.id !== id) {
                this.logger.warn(`[PaymentStatusService] Payment status update failed: name already exists: ${trimmedName}`);
                throw new ValidationException(`Payment status with name '${trimmedName}' already exists`);
            }

            updateData.name = trimmedName;
        }

        if (data.description !== undefined) {
            const trimmedDescription = data.description.trim();
            if (trimmedDescription.length > MAX_DESCRIPTION_LENGTH) {
                this.logger.warn('[PaymentStatusService] Payment status update failed: description too long');
                throw new ValidationException(`Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters`);
            }
            updateData.description = trimmedDescription;
        }

        const paymentStatus = await this.paymentStatusRepository.update(id, updateData);
        this.logger.log(`[PaymentStatusService] Payment status updated successfully: ${paymentStatus.name}`);

        return paymentStatus;
    }

    /**
     * Delete payment status
     */
    async deletePaymentStatus(id: string): Promise<void> {
        this.logger.log(`[PaymentStatusService] Deleting payment status with id: ${id}`);

        // Validate payment status exists
        const paymentStatus = await this.getPaymentStatusById(id);

        await this.paymentStatusRepository.delete(id);
        this.logger.log(`[PaymentStatusService] Payment status deleted successfully: ${paymentStatus.name}`);
    }
}
