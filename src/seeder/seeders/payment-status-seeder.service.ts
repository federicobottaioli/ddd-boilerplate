import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaymentStatusEntity } from '@modules/payment-status/infrastructure/entities/payment-status.orm-entity';
import { APP_LOGGER_TOKEN, type IAppLogger } from '@modules/shared/application/interfaces/app-logger';

/**
 * Payment status data to seed
 */
const PAYMENT_STATUSES_DATA: { name: string; description: string }[] = [
    { name: 'PENDING', description: 'Payment is pending processing' },
    { name: 'PROCESSING', description: 'Payment is being processed' },
    { name: 'AUTHORIZED', description: 'Payment has been authorized' },
    { name: 'CAPTURED', description: 'Payment has been captured' },
    { name: 'FAILED', description: 'Payment processing failed' },
    { name: 'REFUNDED', description: 'Payment has been fully refunded' },
    { name: 'PARTIALLY_REFUNDED', description: 'Payment has been partially refunded' },
];

@Injectable()
export class PaymentStatusSeederService {
    constructor(
        @InjectRepository(PaymentStatusEntity)
        private readonly paymentStatusRepository: Repository<PaymentStatusEntity>,
        @Inject(APP_LOGGER_TOKEN)
        private readonly logger: IAppLogger,
    ) {}

    async seed(): Promise<void> {
        this.logger.log('[PaymentStatusSeeder] Starting to seed payment statuses...');

        const statuses: PaymentStatusEntity[] = [];

        for (const statusData of PAYMENT_STATUSES_DATA) {
            // Check if status already exists by name
            const existingStatus = await this.paymentStatusRepository.findOne({
                where: { name: statusData.name },
            });

            if (!existingStatus) {
                const status = this.paymentStatusRepository.create({
                    name: statusData.name,
                    description: statusData.description,
                });
                statuses.push(status);
            }
        }

        if (statuses.length > 0) {
            await this.paymentStatusRepository.save(statuses);
            this.logger.log(`[PaymentStatusSeeder] Successfully seeded ${statuses.length} payment status records`);
        } else {
            this.logger.log('[PaymentStatusSeeder] All payment statuses already exist');
        }
    }
}
