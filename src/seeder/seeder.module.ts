import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentStatusEntity } from '@modules/payment-status/infrastructure/entities/payment-status.orm-entity';
import { PaymentStatusSeederService } from './seeders/payment-status-seeder.service';
import { PostgresDatabaseProviderModule } from '../db/postgres';

@Module({
    imports: [PostgresDatabaseProviderModule, TypeOrmModule.forFeature([PaymentStatusEntity])],
    providers: [PaymentStatusSeederService],
    exports: [PaymentStatusSeederService],
})
export class SeederModule {}
