import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BaseEntity,
    Index,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { PaymentEntity } from '@modules/payment/infrastructure/entities/payment.orm-entity';
import { TransactionType, TransactionStatus } from '../../domain/entities/transaction';

@Entity('transactions')
export class TransactionEntity extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Index()
    @Column({ type: 'uuid', name: 'payment_id' })
    paymentId: string;

    @ManyToOne(() => PaymentEntity, (payment) => payment.transactions)
    @JoinColumn({ name: 'payment_id' })
    payment: PaymentEntity;

    @Index()
    @Column({ type: 'enum', enum: TransactionType })
    type: TransactionType;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    amount: number;

    @Index()
    @Column({ type: 'enum', enum: TransactionStatus })
    status: TransactionStatus;

    @Column({ type: 'jsonb', name: 'gateway_response' })
    gatewayResponse: Record<string, unknown>;

    @Index()
    @Column({ type: 'varchar', length: 255, nullable: true, name: 'gateway_transaction_id' })
    gatewayTransactionId: string | null;

    @CreateDateColumn({ type: 'timestamp' })
    createdAt: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updatedAt: Date;
}
