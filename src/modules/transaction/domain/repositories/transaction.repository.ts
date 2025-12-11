import { Transaction } from '../entities/transaction';
import { CreateTransactionData } from '../types/transaction.types';

/**
 * Repository interface for Transaction domain operations.
 * This defines the contract for transaction data access operations.
 */
export abstract class TransactionRepository {
    /**
     * Find a transaction by ID
     * @param id - Transaction ID
     */
    abstract findById(id: string): Promise<Transaction | null>;

    /**
     * Find transactions by payment ID
     * @param paymentId - Payment ID
     */
    abstract findByPaymentId(paymentId: string): Promise<Transaction[]>;

    /**
     * Create a new transaction
     * @param transaction - Data to create
     */
    abstract create(transaction: CreateTransactionData): Promise<Transaction>;

    /**
     * Update a transaction
     * @param id - Transaction ID
     * @param updates - Partial data to update
     */
    abstract update(id: string, updates: Partial<Transaction>): Promise<Transaction>;
}
