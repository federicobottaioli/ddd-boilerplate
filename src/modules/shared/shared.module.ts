import { Module, Global } from '@nestjs/common';
import { APP_LOGGER_TOKEN } from './application/interfaces/app-logger';
import PinoAppLogger from './infrastructure/logger/pino.app-logger';

const AppLoggerProvider = {
    provide: APP_LOGGER_TOKEN,
    useClass: PinoAppLogger,
};

@Global()
@Module({
    providers: [AppLoggerProvider],
    exports: [AppLoggerProvider],
})
export class SharedModule {}
