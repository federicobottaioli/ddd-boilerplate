import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    DeleteDateColumn,
    BaseEntity,
    Index,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { CustomerEntity } from '@modules/customer/infrastructure/entities/customer.orm-entity';
import { PaymentStatusEntity } from '@modules/payment-status/infrastructure/entities/payment-status.orm-entity';
import { TransactionEntity } from '@modules/transaction/infrastructure/entities/transaction.orm-entity';

@Entity('payments')
export class PaymentEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Index()
    @Column({ type: 'varchar', length: 3 })
    currency: string;

    @Column({ type: 'varchar', length: 100, name: 'card_token' })
    cardToken: string;

    @Index()
    @Column({ type: 'varchar', length: 100, name: 'merchant_reference' })
    merchantReference: string;

    @Index()
    @Column({ type: 'uuid', name: 'customer_id' })
    customerId: string;

    @ManyToOne(() => CustomerEntity)
    @JoinColumn({ name: 'customer_id' })
    customer: CustomerEntity;

    @Index()
    @Column({ type: 'uuid', name: 'payment_status_id' })
    paymentStatusId: string;

    @ManyToOne(() => PaymentStatusEntity)
    @JoinColumn({ name: 'payment_status_id' })
    paymentStatus: PaymentStatusEntity;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, unknown>;

    @OneToMany(() => TransactionEntity, (transaction) => transaction.payment, { cascade: true })
    transactions: TransactionEntity[];

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;

    @DeleteDateColumn({ type: 'timestamp', name: 'deleted_at', nullable: true })
    deletedAt: Date | null;
}
