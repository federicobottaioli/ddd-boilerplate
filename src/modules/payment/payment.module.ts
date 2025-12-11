import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './infrastructure/entities/payment.orm-entity';
import { PaymentRepositoryImpl } from './infrastructure/repositories/typeorm/payment.repository.impl';
import { PaymentService } from './domain/services/payment.service';
import { PaymentController } from './controllers/payment.controller';
import { CustomerModule } from '@modules/customer/customer.module';
import { PaymentStatusModule } from '@modules/payment-status/payment-status.module';
import { TransactionModule } from '@modules/transaction/transaction.module';
import { MpgsPaymentAdapter } from './infrastructure/adapters/mpgs-payment.adapter';
import { CyberSourcePaymentAdapter } from './infrastructure/adapters/cybersource-payment.adapter';

/**
 * Payment Module
 * Note: In production, you would configure which gateway adapter to use via environment variables
 */
@Module({
    imports: [
        TypeOrmModule.forFeature([PaymentEntity]),
        CustomerModule,
        PaymentStatusModule,
        TransactionModule,
    ],
    controllers: [PaymentController],
    providers: [
        {
            provide: 'PaymentRepository',
            useClass: PaymentRepositoryImpl,
        },
        {
            provide: 'PaymentGatewayPort',
            // In production, use environment variable to select adapter
            // For this boilerplate, we'll use MPGS as default
            useClass: MpgsPaymentAdapter,
            // Alternative: useClass: CyberSourcePaymentAdapter,
        },
        PaymentService,
        MpgsPaymentAdapter,
        CyberSourcePaymentAdapter,
    ],
    exports: [PaymentService, 'PaymentRepository'],
})
export class PaymentModule {}
