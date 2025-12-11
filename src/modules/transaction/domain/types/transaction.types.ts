import { TransactionType, TransactionStatus } from '../entities/transaction';

/**
 * Data required to create a new transaction (excluding computed properties and auto-generated fields)
 */
export type CreateTransactionData = {
    paymentId: string;
    type: TransactionType;
    amount: number;
    status: TransactionStatus;
    gatewayResponse: Record<string, unknown>;
    gatewayTransactionId?: string | null;
};
