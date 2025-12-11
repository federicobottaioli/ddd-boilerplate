import { AppConfig } from './app/app-config.type';
import { DbConfig } from './database/postgres/db-config.type';

export type AllConfig = {
    app: AppConfig;
    'postgres-database': DbConfig;
};
