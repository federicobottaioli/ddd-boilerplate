/**
 * Data required to create a new payment (excluding computed properties and auto-generated fields)
 */
export type CreatePaymentData = {
    amount: number;
    currency: string;
    cardToken: string;
    merchantReference: string;
    customerId: string;
    paymentStatusId: string;
    metadata?: Record<string, unknown>;
};

/**
 * Filters for payment pagination query
 */
export type PaymentFilters = {
    customerId?: string;
    paymentStatusId?: string;
    merchantReference?: string;
    minAmount?: number;
    maxAmount?: number;
    currency?: string;
};
