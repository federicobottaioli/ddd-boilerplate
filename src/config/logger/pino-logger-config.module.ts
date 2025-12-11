import { Module, RequestMethod } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { AppConfigService } from '@config/app/app-config.service';
import { AppConfigModule } from '@config/app/app-config.module';
import { randomUUID } from 'node:crypto';

import { version, name } from '../../../package.json';

@Module({
    imports: [
        LoggerModule.forRootAsync({
            imports: [AppConfigModule],
            inject: [AppConfigService],
            useFactory: async (config: AppConfigService) => {
                const isProductionEnv = config.nodeEnv === 'production';
                return {
                    pinoHttp: {
                        level: config.logLevel,
                        genReqId: (request, response) => {
                            const existingId = request.id ?? request.headers['x-request-id'];
                            if (existingId) return existingId;
                            const newId = randomUUID();
                            response.setHeader('x-request-id', newId);
                            return newId;
                        },
                        messageKey: 'message',
                        errorKey: 'error',
                        formatters: {
                            bindings: (bindings) => {
                                return isProductionEnv
                                    ? {
                                          pid: bindings.pid,
                                          host: bindings.hostname,
                                          node_version: process.version,
                                          app_name: name,
                                          app_version: version,
                                      }
                                    : {};
                            },
                            level: (label) => {
                                return { level: label.toUpperCase() };
                            },
                        },
                        transport: isProductionEnv
                            ? undefined
                            : {
                                  target: 'pino-pretty',
                                  options: {
                                      colorize: true,
                                      translateTime: 'HH:MM:ss',
                                      ignore: 'pid,hostname,request,response,req,res',
                                      singleLine: true,
                                      hideObject: false,
                                  },
                              },
                        customAttributeKeys: {
                            req: 'request',
                            res: 'response',
                            err: 'error',
                        },
                        redact: ['request.headers.authorization'],
                        exclude: [{ method: RequestMethod.ALL, path: 'health' }],
                    },
                };
            },
        }),
    ],
})
export class PinoLoggerConfigModule {}
