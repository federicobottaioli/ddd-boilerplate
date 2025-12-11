import { Expose, Transform } from 'class-transformer';

/**
 * Pure domain entity for Customer.
 * Contains business logic and rules, independent of persistence technology.
 * Uses class-transformer decorators for JSON serialization control.
 */
export class Customer {
    @Expose()
    public readonly id: string;

    @Expose()
    public name: string;

    @Expose()
    public email: string;

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
        email: string,
        createdAt: Date,
        updatedAt: Date,
        deletedAt?: Date | null,
    ) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.deletedAt = deletedAt ?? null;
    }

    /**
     * Create a new Customer instance
     */
    static create(data: { name: string; email: string }): Customer {
        const now = new Date();
        return new Customer(
            '', // ID will be set by repository
            data.name,
            data.email,
            now,
            now,
        );
    }

    /**
     * Update customer information
     */
    update(data: { name?: string; email?: string }): void {
        if (data.name !== undefined) {
            this.name = data.name;
        }
        if (data.email !== undefined) {
            this.email = data.email;
        }
        this.updatedAt = new Date();
    }
}
