import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { HealthModule } from '@modules/health/health.module';
import { AppConfigModule } from '@config/app/app-config.module';
import { PinoLoggerConfigModule } from '@config/logger/pino-logger-config.module';
import { PostgresDatabaseProviderModule } from './db/postgres';
import { SharedModule } from '@modules/shared/shared.module';
import { DomainExceptionFilter } from '@modules/shared/infrastructure/filters';
import { PaymentStatusModule } from '@modules/payment-status/payment-status.module';
import { CustomerModule } from '@modules/customer/customer.module';
import { PaymentModule } from '@modules/payment/payment.module';
import { TransactionModule } from '@modules/transaction/transaction.module';

@Module({
    imports: [
        AppConfigModule,
        PinoLoggerConfigModule,
        PostgresDatabaseProviderModule,
        HealthModule,
        SharedModule,
        PaymentStatusModule,
        CustomerModule,
        TransactionModule,
        PaymentModule,
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: DomainExceptionFilter,
        },
    ],
})
export class AppModule {}
