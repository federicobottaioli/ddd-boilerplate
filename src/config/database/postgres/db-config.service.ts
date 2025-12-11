import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { AllConfig } from '../../configuration.type';

@Injectable()
export class PostgresDbConfigService {
    constructor(private configService: ConfigService<AllConfig>) {}

    public get username(): string | undefined {
        return this.configService.get('postgres-database.username', { infer: true });
    }

    public get password(): string | undefined {
        return this.configService.get('postgres-database.password', { infer: true });
    }

    public get database(): string {
        return this.configService.getOrThrow('postgres-database.database', { infer: true });
    }

    public get host(): string {
        return this.configService.getOrThrow('postgres-database.host', { infer: true });
    }

    public get port(): number {
        return this.configService.getOrThrow('postgres-database.port', { infer: true });
    }

    public get synchronize(): boolean {
        return this.configService.getOrThrow('postgres-database.synchronize', { infer: true });
    }

    public get logging(): boolean {
        return this.configService.getOrThrow('postgres-database.logging', { infer: true });
    }
}
