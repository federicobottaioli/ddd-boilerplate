export interface IAppLogger {
    log(message: string): void;
    error(message: string, trace?: string): void;
    warn(message: string): void;
    debug?(message: string): void;
}

export const APP_LOGGER_TOKEN = 'AppLogger';
