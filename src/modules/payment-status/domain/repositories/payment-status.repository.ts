import { PaymentStatus } from '../entities/payment-status';
import { CreatePaymentStatusData } from '../types/payment-status.types';

/**
 * Repository interface for PaymentStatus domain operations.
 * This defines the contract for payment status data access operations.
 */
export abstract class PaymentStatusRepository {
    /**
     * Find a payment status by ID
     * @param id - PaymentStatus ID
     */
    abstract findById(id: string): Promise<PaymentStatus | null>;

    /**
     * Find a payment status by name
     * @param name - PaymentStatus name
     */
    abstract findByName(name: string): Promise<PaymentStatus | null>;

    /**
     * Create a new payment status
     * @param paymentStatus - Data to create
     */
    abstract create(paymentStatus: CreatePaymentStatusData): Promise<PaymentStatus>;

    /**
     * Update a payment status
     * @param id - PaymentStatus ID
     * @param updates - Partial data to update
     */
    abstract update(id: string, updates: Partial<PaymentStatus>): Promise<PaymentStatus>;

    /**
     * Delete a payment status
     * @param id - PaymentStatus ID
     */
    abstract delete(id: string): Promise<void>;

    /**
     * Find payment statuses with pagination and optional filters
     * @param page - Page number (1-based)
     * @param limit - Number of items per page
     * @param name - Optional filter by name
     * @param sortBy - Field to sort by
     * @param sortOrder - Sort order (ASC or DESC)
     */
    abstract findWithPagination(
        page: number,
        limit: number,
        name?: string,
        sortBy?: string,
        sortOrder?: 'ASC' | 'DESC',
    ): Promise<{ paymentStatuses: PaymentStatus[]; total: number }>;
}
