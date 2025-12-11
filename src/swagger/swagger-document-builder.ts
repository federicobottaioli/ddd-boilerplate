import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export class SwaggerDocumentBuilder {
    constructor(private readonly app: INestApplication<any>) {}

    private buildConfig() {
        const docBuilder = new DocumentBuilder()
            .setTitle('DDD Payment Boilerplate API')
            .setDescription('DDD Payment Boilerplate API - Hexagonal Architecture Example with Payment Processing.')
            .setVersion('1.0')
            .addTag('payments', 'Payment operations')
            .addTag('transactions', 'Transaction operations')
            .addTag('customers', 'Customer operations')
            .addTag('payment-statuses', 'Payment status catalog');
        return docBuilder.build();
    }

    private createDocument() {
        const config = this.buildConfig();
        return SwaggerModule.createDocument(this.app, config);
    }

    public setupSwagger() {
        const document = this.createDocument();

        SwaggerModule.setup('docs', this.app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                defaultModelsExpandDepth: -1,
            },
        });
    }
}
