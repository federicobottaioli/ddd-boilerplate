import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { SeederModule } from './seeder/seeder.module';
import { PaymentStatusSeederService } from './seeder/seeders/payment-status-seeder.service';

const logger = new Logger('Seeder');

async function bootstrap() {
    const app = await NestFactory.createApplicationContext(SeederModule);
    const paymentStatusSeeder = app.get(PaymentStatusSeederService);

    try {
        logger.log('🌱 Starting database seeding...');
        await paymentStatusSeeder.seed();
        logger.log('✅ Database seeding completed successfully!');
    } catch (error) {
        logger.error('❌ Database seeding failed:', error);
        process.exit(1);
    } finally {
        await app.close();
    }
}

bootstrap();
