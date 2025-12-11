import { registerAs } from '@nestjs/config';
import { DbConfig } from './db-config.type';
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import validateConfig from '../../helpers/validate-config';

class EnvVariablesValidator {
    @IsNotEmpty()
    @IsString()
    DB_HOST: string;

    @IsNotEmpty()
    @IsInt()
    DB_PORT: number;

    @IsOptional()
    @IsString()
    DB_USERNAME: string;

    @IsString()
    @IsOptional()
    DB_PASSWORD: string;

    @IsNotEmpty()
    @IsString()
    DB_DATABASE: string;

    @IsBoolean()
    @IsOptional()
    DB_SYNCHRONIZE: boolean;

    @IsBoolean()
    @IsOptional()
    DB_LOGGING: boolean;
}

export default registerAs<DbConfig>('postgres-database', () => {
    validateConfig(process.env, EnvVariablesValidator);
    return {
        host: process.env.DB_HOST!,
        port: Number(process.env.DB_PORT) || 5432,
        username: process.env.DB_USERNAME!,
        password: process.env.DB_PASSWORD!,
        database: process.env.DB_DATABASE!,
        synchronize: process.env.DB_SYNCHRONIZE === 'true',
        logging: process.env.DB_LOGGING === 'true',
    };
});
