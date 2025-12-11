import { Customer } from '../entities/customer';
import { CreateCustomerData } from '../types/customer.types';

/**
 * Repository interface for Customer domain operations.
 * This defines the contract for customer data access operations.
 */
export abstract class CustomerRepository {
    /**
     * Find a customer by ID
     * @param id - Customer ID
     */
    abstract findById(id: string): Promise<Customer | null>;

    /**
     * Create a new customer
     * @param customer - Data to create
     */
    abstract create(customer: CreateCustomerData): Promise<Customer>;

    /**
     * Update a customer
     * @param id - Customer ID
     * @param updates - Partial data to update
     */
    abstract update(id: string, updates: Partial<Customer>): Promise<Customer>;

    /**
     * Delete a customer
     * @param id - Customer ID
     */
    abstract delete(id: string): Promise<void>;

    /**
     * Find customers with pagination and optional filters
     * @param page - Page number (1-based)
     * @param limit - Number of items per page
     * @param name - Optional filter by name
     * @param email - Optional filter by email
     * @param sortBy - Field to sort by
     * @param sortOrder - Sort order (ASC or DESC)
     */
    abstract findWithPagination(
        page: number,
        limit: number,
        name?: string,
        email?: string,
        sortBy?: string,
        sortOrder?: 'ASC' | 'DESC',
    ): Promise<{ customers: Customer[]; total: number }>;
}
