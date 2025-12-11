import { Expose, Transform } from 'class-transformer';

/**
 * Pure domain entity for PaymentStatus.
 * Contains business logic and rules, independent of persistence technology.
 * Uses class-transformer decorators for JSON serialization control.
 */
export class PaymentStatus {
    @Expose()
    public readonly id: string;

    @Expose()
    public name: string;

    @Expose()
    public description: string;

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
        name: string,
        description: string,
        createdAt: Date,
        updatedAt: Date,
        deletedAt?: Date | null,
    ) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt ?? null;
    }

    /**
     * Create a new PaymentStatus instance
     */
    static create(data: { name: string; description?: string }): PaymentStatus {
        const now = new Date();
        return new PaymentStatus(
            '', // ID will be set by repository
            data.name,
            data.description || '',
            now,
            now,
        );
    }

    /**
     * Update payment status information
     */
    update(data: { name?: string; description?: string }): void {
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.description !== undefined) {
            this.description = data.description;
        }
        this.updatedAt = new Date();
    }
}
