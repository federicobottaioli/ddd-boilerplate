import { Payment } from '../entities/payment';
import { CreatePaymentData, PaymentFilters } from '../types/payment.types';

/**
 * Repository interface for Payment domain operations.
 * This defines the contract for payment data access operations.
 */
export abstract class PaymentRepository {
    /**
     * Find a payment by ID
     * @param id - Payment ID
     * @param withRelations - Whether to load related entities (default: false)
     */
    abstract findById(id: string, withRelations?: boolean): Promise<Payment | null>;

    /**
     * Create a new payment
     * @param payment - Data to create
     */
    abstract create(payment: CreatePaymentData): Promise<Payment>;

    /**
     * Update a payment
     * @param id - Payment ID
     * @param updates - Partial data to update
     */
    abstract update(id: string, updates: Partial<Payment>): Promise<Payment>;

    /**
     * Delete a payment
     * @param id - Payment ID
     */
    abstract delete(id: string): Promise<void>;

    /**
     * Find payments with pagination and optional filters
     * @param page - Page number (1-based)
     * @param limit - Number of items per page
     * @param filters - Filter criteria
     * @param sortBy - Field to sort by (default: createdAt)
     * @param sortOrder - Sort order (ASC or DESC, default: DESC)
     */
    abstract findWithPagination(
        page: number,
        limit: number,
        filters: PaymentFilters,
        sortBy?: string,
        sortOrder?: 'ASC' | 'DESC',
    ): Promise<{ payments: Payment[]; total: number }>;
}
