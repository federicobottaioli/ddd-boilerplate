import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CustomerEntity } from './infrastructure/entities/customer.orm-entity';
import { CustomerRepositoryImpl } from './infrastructure/repositories/typeorm/customer.repository.impl';
import { CustomerService } from './domain/services/customer.service';
import { CustomerController } from './controllers/customer.controller';

/**
 * Customer Module
 */
@Module({
    imports: [TypeOrmModule.forFeature([CustomerEntity])],
    controllers: [CustomerController],
    providers: [
        {
            provide: 'CustomerRepository',
            useClass: CustomerRepositoryImpl,
        },
        CustomerService,
    ],
    exports: [CustomerService, 'CustomerRepository'],
})
export class CustomerModule {}
