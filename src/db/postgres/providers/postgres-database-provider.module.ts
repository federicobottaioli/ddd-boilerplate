import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { PostgresDbConfigModule } from '@config/database/postgres/db-config.module';
import { PostgresDbConfigService } from '@config/database/postgres/db-config.service';
import { createPostgresDataSourceOptions } from '../datasources/postgres-data-source';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [PostgresDbConfigModule],
            useFactory: async (dbConfigService: PostgresDbConfigService) => {
                return createPostgresDataSourceOptions(dbConfigService);
            },
            inject: [PostgresDbConfigService],
        } as TypeOrmModuleAsyncOptions),
    ],
})
export class PostgresDatabaseProviderModule {}
