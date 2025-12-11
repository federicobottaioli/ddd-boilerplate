/**
 * Request for authorizing a payment
 */
export interface AuthorizePaymentRequest {
    amount: number;
    currency: string;
    cardToken: string;
    merchantReference: string;
    metadata?: Record<string, unknown>;
}

/**
 * Response from payment gateway
 */
export interface GatewayResponse {
    success: boolean;
    transactionId: string;
    status: string;
    message?: string;
    errorCode?: string;
    errorMessage?: string;
    rawResponse?: Record<string, unknown>;
}

/**
 * Gateway status response
 */
export interface GatewayStatus {
    transactionId: string;
    status: string;
    amount: number;
    currency: string;
    message?: string;
}

/**
 * Payment Gateway Port (Hexagonal Architecture)
 * This is the domain port that defines the contract for payment gateway operations.
 * Infrastructure adapters (MPGS, CyberSource, etc.) will implement this interface.
 */
export abstract class PaymentGatewayPort {
    /**
     * Authorize a payment
     * @param request - Payment authorization request
     * @returns Gateway response with transaction ID
     */
    abstract authorize(request: AuthorizePaymentRequest): Promise<GatewayResponse>;

    /**
     * Capture an authorized payment
     * @param transactionId - Transaction ID from authorization
     * @param amount - Amount to capture (can be partial)
     * @returns Gateway response
     */
    abstract capture(transactionId: string, amount: number): Promise<GatewayResponse>;

    /**
     * Refund a payment
     * @param transactionId - Transaction ID from capture
     * @param amount - Amount to refund (can be partial)
     * @returns Gateway response
     */
    abstract refund(transactionId: string, amount: number): Promise<GatewayResponse>;

    /**
     * Get transaction status from gateway
     * @param transactionId - Transaction ID
     * @returns Gateway status
     */
    abstract getStatus(transactionId: string): Promise<GatewayStatus>;
}
