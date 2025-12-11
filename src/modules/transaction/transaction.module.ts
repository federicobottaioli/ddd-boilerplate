import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionEntity } from './infrastructure/entities/transaction.orm-entity';
import { TransactionRepositoryImpl } from './infrastructure/repositories/typeorm/transaction.repository.impl';

/**
 * Transaction Module
 */
@Module({
    imports: [TypeOrmModule.forFeature([TransactionEntity])],
    providers: [
        {
            provide: 'TransactionRepository',
            useClass: TransactionRepositoryImpl,
        },
    ],
    exports: ['TransactionRepository'],
})
export class TransactionModule {}
