import { Injectable } from '@nestjs/common';
import {
    PaymentGatewayPort,
    AuthorizePaymentRequest,
    GatewayResponse,
    GatewayStatus,
} from '../../domain/ports/payment-gateway.port';
import { APP_LOGGER_TOKEN, type IAppLogger } from '@modules/shared/application/interfaces/app-logger';
import { Inject } from '@nestjs/common';

/**
 * MPGS (Mastercard Payment Gateway Services) Payment Adapter
 * This is a mock implementation showing the adapter pattern.
 * In a real implementation, this would make actual HTTP calls to MPGS API.
 */
@Injectable()
export class MpgsPaymentAdapter implements PaymentGatewayPort {
    constructor(
        @Inject(APP_LOGGER_TOKEN)
        private readonly logger: IAppLogger,
    ) {}

    async authorize(request: AuthorizePaymentRequest): Promise<GatewayResponse> {
        this.logger.log(`[MpgsPaymentAdapter] Authorizing payment: ${request.merchantReference}`);

        // Mock implementation - In production, this would call MPGS API
        // Example: const response = await this.httpClient.post('https://api.mastercard.com/gateway/authorize', {...});

        // Simulate API call delay
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Mock successful response
        const mockTransactionId = `MPGS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        return {
            success: true,
            transactionId: mockTransactionId,
            status: 'AUTHORIZED',
            message: 'Payment authorized successfully',
            rawResponse: {
                gateway: 'MPGS',
                transactionId: mockTransactionId,
                status: 'AUTHORIZED',
            },
        };
    }

    async capture(transactionId: string, amount: number): Promise<GatewayResponse> {
        this.logger.log(`[MpgsPaymentAdapter] Capturing payment: ${transactionId}, amount: ${amount}`);

        // Mock implementation
        await new Promise((resolve) => setTimeout(resolve, 100));

        return {
            success: true,
            transactionId: transactionId,
            status: 'CAPTURED',
            message: 'Payment captured successfully',
            rawResponse: {
                gateway: 'MPGS',
                transactionId: transactionId,
                status: 'CAPTURED',
                amount: amount,
            },
        };
    }

    async refund(transactionId: string, amount: number): Promise<GatewayResponse> {
        this.logger.log(`[MpgsPaymentAdapter] Refunding payment: ${transactionId}, amount: ${amount}`);

        // Mock implementation
        await new Promise((resolve) => setTimeout(resolve, 100));

        return {
            success: true,
            transactionId: transactionId,
            status: 'REFUNDED',
            message: 'Payment refunded successfully',
            rawResponse: {
                gateway: 'MPGS',
                transactionId: transactionId,
                status: 'REFUNDED',
                amount: amount,
            },
        };
    }

    async getStatus(transactionId: string): Promise<GatewayStatus> {
        this.logger.log(`[MpgsPaymentAdapter] Getting status for transaction: ${transactionId}`);

        // Mock implementation
        await new Promise((resolve) => setTimeout(resolve, 50));

        return {
            transactionId: transactionId,
            status: 'CAPTURED',
            amount: 100.0,
            currency: 'USD',
            message: 'Transaction is captured',
        };
    }
}
