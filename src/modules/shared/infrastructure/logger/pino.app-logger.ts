import { Logger as NestLogger } from '@nestjs/common';
import { IAppLogger } from '@modules/shared/application/interfaces/app-logger';

export default class PinoAppLogger implements IAppLogger {
    private readonly nestLogger;

    constructor() {
        this.nestLogger = new NestLogger();
    }

    log(message: string): void {
        this.nestLogger.log(message);
    }

    error(message: string, trace?: string): void {
        this.nestLogger.error(message, trace);
    }

    warn(message: string): void {
        this.nestLogger.warn(message);
    }

    debug?(message: string): void {
        this.nestLogger.debug(message);
    }
}
