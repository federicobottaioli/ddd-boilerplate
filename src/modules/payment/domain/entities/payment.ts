import { Expose, Transform } from 'class-transformer';

/**
 * Payment status enumeration
 */
export enum PaymentStatusEnum {
    PENDING = 'PENDING',
    PROCESSING = 'PROCESSING',
    AUTHORIZED = 'AUTHORIZED',
    CAPTURED = 'CAPTURED',
    FAILED = 'FAILED',
    REFUNDED = 'REFUNDED',
    PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

/**
 * Pure domain entity for Payment.
 * Contains business logic and rules, independent of persistence technology.
 * Uses class-transformer decorators for JSON serialization control.
 */
export class Payment {
    @Expose()
    public readonly id: string;

    @Expose()
    public amount: number;

    @Expose()
    public currency: string;

    @Expose()
    public cardToken: string;

    @Expose()
    public merchantReference: string;

    @Expose()
    public customerId: string;

    @Expose()
    public paymentStatusId: string;

    @Expose()
    public metadata: Record<string, unknown>;

    @Expose()
    @Transform(({ value }) => value?.toISOString())
    public readonly createdAt: Date;

    @Expose()
    @Transform(({ value }) => value?.toISOString())
    public updatedAt: Date;

    @Expose()
    @Transform(({ value }) => value?.toISOString())
    public deletedAt: Date | null;

    constructor(
        id: string,
        amount: number,
        currency: string,
        cardToken: string,
        merchantReference: string,
        customerId: string,
        paymentStatusId: string,
        metadata: Record<string, unknown>,
        createdAt: Date,
        updatedAt: Date,
        deletedAt?: Date | null,
    ) {
        this.id = id;
        this.amount = amount;
        this.currency = currency;
        this.cardToken = cardToken;
        this.merchantReference = merchantReference;
        this.customerId = customerId;
        this.paymentStatusId = paymentStatusId;
        this.metadata = metadata;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt ?? null;
    }

    /**
     * Create a new Payment instance
     */
    static create(data: {
        amount: number;
        currency: string;
        cardToken: string;
        merchantReference: string;
        customerId: string;
        paymentStatusId: string;
        metadata?: Record<string, unknown>;
    }): Payment {
        const now = new Date();
        return new Payment(
            '', // ID will be set by repository
            data.amount,
            data.currency,
            data.cardToken,
            data.merchantReference,
            data.customerId,
            data.paymentStatusId,
            data.metadata || {},
            now,
            now,
        );
    }

    /**
     * Update payment status
     */
    updateStatus(paymentStatusId: string): void {
        this.paymentStatusId = paymentStatusId;
        this.updatedAt = new Date();
    }

    /**
     * Update payment metadata
     */
    updateMetadata(metadata: Record<string, unknown>): void {
        this.metadata = { ...this.metadata, ...metadata };
        this.updatedAt = new Date();
    }

    /**
     * Check if payment can be processed
     * Note: This method compares by status name, not ID.
     * In production, you might want to inject PaymentStatusRepository to check by ID.
     */
    canBeProcessed(statusName?: string): boolean {
        // If status name is provided, use it; otherwise assume PENDING by ID comparison
        // This is a simplified check - in real implementation, you'd check against actual status
        return statusName === PaymentStatusEnum.PENDING || !statusName;
    }

    /**
     * Check if payment can be refunded
     * Note: This method compares by status name, not ID.
     */
    canBeRefunded(statusName?: string): boolean {
        return (
            statusName === PaymentStatusEnum.CAPTURED ||
            statusName === PaymentStatusEnum.PARTIALLY_REFUNDED
        );
    }
}
