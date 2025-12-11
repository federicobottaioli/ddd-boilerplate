import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentStatusEntity } from './infrastructure/entities/payment-status.orm-entity';
import { PaymentStatusRepositoryImpl } from './infrastructure/repositories/typeorm/payment-status.repository.impl';
import { PaymentStatusService } from './domain/services/payment-status.service';
import { PaymentStatusController } from './controllers/payment-status.controller';

/**
 * Payment Status Module
 */
@Module({
    imports: [TypeOrmModule.forFeature([PaymentStatusEntity])],
    controllers: [PaymentStatusController],
    providers: [
        {
            provide: 'PaymentStatusRepository',
            useClass: PaymentStatusRepositoryImpl,
        },
        PaymentStatusService,
    ],
    exports: [PaymentStatusService, 'PaymentStatusRepository'],
})
export class PaymentStatusModule {}
