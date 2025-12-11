import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';
import { AppConfigService } from '@config/app/app-config.service';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerDocumentBuilder } from '@swagger/swagger-document-builder';

async function bootstrap() {
    const app = await NestFactory.create(AppModule, { bufferLogs: true });

    const appConfig: AppConfigService = app.get(AppConfigService);

    // configure logger
    const logger = app.get(Logger);
    app.useLogger(logger);

    app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
    app.use(helmet());
    app.enableCors();
    app.enableShutdownHooks();

    app.setGlobalPrefix(appConfig.apiPrefix);

    if (!appConfig.skipSwaggerDocs) {
        new SwaggerDocumentBuilder(app).setupSwagger();
    }

    await app.listen(appConfig.port);
    logger.log(`Application is running on: ${appConfig.url}:${appConfig.port}`);
}

void bootstrap();
