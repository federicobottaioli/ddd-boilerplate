import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { PostgresDbConfigService } from '@config/database/postgres/db-config.service';

/**
 * Creates a unified PostgreSQL DataSource configuration
 * Can work with either PostgresDbConfigService or environment variables
 * Dynamically loads .env.development when configService is not available (CLI context)
 */
export function createPostgresDataSourceOptions(configService?: PostgresDbConfigService): DataSourceOptions {
    const baseConfig: DataSourceOptions = {
        type: 'postgres',
        migrations: [__dirname + '/../migrations/**/*{.ts,.js}'],
        entities: [__dirname + '/../../../**/*.orm-entity{.ts,.js}'],
        dropSchema: false,
    };

    if (configService) {
        // Use config service when available (NestJS context)
        return {
            ...baseConfig,
            host: configService.host,
            port: configService.port,
            username: configService.username,
            password: configService.password || '',
            database: configService.database,
            logging: configService.logging,
            synchronize: configService.synchronize,
        } as DataSourceOptions;
    } else {
        // Use environment variables (CLI/migrations context)
        // Dynamically load .env.development if not already loaded
        if (!process.env.DB_HOST && !process.env.DB_PORT) {
            config({ path: ['.env.development', '.env'] });
        }

        // Override host for CLI context (host.docker.internal doesn't resolve from host)
        const dbHost =
            process.env.DB_HOST === 'host.docker.internal' ? '127.0.0.1' : process.env.DB_HOST || '127.0.0.1';

        return {
            ...baseConfig,
            host: dbHost,
            port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5434,
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            logging: process.env.DB_LOGGING === 'true',
            synchronize: process.env.DB_SYNCHRONIZE === 'true',
        } as DataSourceOptions;
    }
}

// Export the DataSource for CLI usage (migrations, etc.)
export const PostgresDatabaseDataSource = new DataSource(createPostgresDataSourceOptions());
