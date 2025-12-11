import { Expose, Transform } from 'class-transformer';

/**
 * Transaction type enumeration
 */
export enum TransactionType {
    AUTHORIZATION = 'AUTHORIZATION',
    CAPTURE = 'CAPTURE',
    REFUND = 'REFUND',
}

/**
 * Transaction status enumeration
 */
export enum TransactionStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

/**
 * Pure domain entity for Transaction.
 * Contains business logic and rules, independent of persistence technology.
 * Uses class-transformer decorators for JSON serialization control.
 */
export class Transaction {
    @Expose()
    public readonly id: string;

    @Expose()
    public paymentId: string;

    @Expose()
    public type: TransactionType;

    @Expose()
    public amount: number;

    @Expose()
    public status: TransactionStatus;

    @Expose()
    public gatewayResponse: Record<string, unknown>;

    @Expose()
    public gatewayTransactionId: string | null;

    @Expose()
    @Transform(({ value }) => value?.toISOString())
    public readonly createdAt: Date;

    @Expose()
    @Transform(({ value }) => value?.toISOString())
    public updatedAt: Date;

    constructor(
        id: string,
        paymentId: string,
        type: TransactionType,
        amount: number,
        status: TransactionStatus,
        gatewayResponse: Record<string, unknown>,
        gatewayTransactionId: string | null,
        createdAt: Date,
        updatedAt: Date,
    ) {
        this.id = id;
        this.paymentId = paymentId;
        this.type = type;
        this.amount = amount;
        this.status = status;
        this.gatewayResponse = gatewayResponse;
        this.gatewayTransactionId = gatewayTransactionId;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    /**
     * Create a new Transaction instance
     */
    static create(data: {
        paymentId: string;
        type: TransactionType;
        amount: number;
        status: TransactionStatus;
        gatewayResponse: Record<string, unknown>;
        gatewayTransactionId?: string | null;
    }): Transaction {
        const now = new Date();
        return new Transaction(
            '', // ID will be set by repository
            data.paymentId,
            data.type,
            data.amount,
            data.status,
            data.gatewayResponse,
            data.gatewayTransactionId || null,
            now,
            now,
        );
    }

    /**
     * Mark transaction as successful
     */
    markAsSuccess(gatewayTransactionId: string, gatewayResponse: Record<string, unknown>): void {
        this.status = TransactionStatus.SUCCESS;
        this.gatewayTransactionId = gatewayTransactionId;
        this.gatewayResponse = { ...this.gatewayResponse, ...gatewayResponse };
        this.updatedAt = new Date();
    }

    /**
     * Mark transaction as failed
     */
    markAsFailed(gatewayResponse: Record<string, unknown>): void {
        this.status = TransactionStatus.FAILED;
        this.gatewayResponse = { ...this.gatewayResponse, ...gatewayResponse };
        this.updatedAt = new Date();
    }
}
