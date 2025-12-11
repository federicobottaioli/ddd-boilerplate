import { Module } from '@nestjs/common';
import configuration from './db-config';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PostgresDbConfigService } from './db-config.service';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration],
        }),
    ],
    providers: [ConfigService, PostgresDbConfigService],
    exports: [PostgresDbConfigService],
})
export class PostgresDbConfigModule {}
