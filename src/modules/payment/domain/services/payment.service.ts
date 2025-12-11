import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Payment } from '../entities/payment';
import { PaymentRepository } from '../repositories/payment.repository';
import { PaymentGatewayPort } from '../ports/payment-gateway.port';
import { TransactionRepository } from '@modules/transaction/domain/repositories/transaction.repository';
import { Transaction, TransactionType, TransactionStatus } from '@modules/transaction/domain/entities/transaction';
import { CustomerRepository } from '@modules/customer/domain/repositories/customer.repository';
import { PaymentStatusRepository } from '@modules/payment-status/domain/repositories/payment-status.repository';
import {
    MIN_AMOUNT,
    MAX_AMOUNT,
    MIN_CARD_TOKEN_LENGTH,
    MAX_CARD_TOKEN_LENGTH,
    MIN_MERCHANT_REFERENCE_LENGTH,
    MAX_MERCHANT_REFERENCE_LENGTH,
    CURRENCY_CODE_LENGTH,
} from '../constants/payment.constants';
import { APP_LOGGER_TOKEN, type IAppLogger } from '@modules/shared/application/interfaces/app-logger';
import { EntityNotFoundException, ValidationException, PaymentException } from '@modules/shared/domain/exceptions';
import { CreatePaymentData, PaymentFilters } from '../types/payment.types';

/**
 * Domain service for Payment business logic operations.
 * Contains all business rules and operations related to payments.
 */
@Injectable()
export class PaymentService {
    constructor(
        @Inject('PaymentRepository')
        private readonly paymentRepository: PaymentRepository,
        @Inject('PaymentGatewayPort')
        private readonly paymentGateway: PaymentGatewayPort,
        @Inject('TransactionRepository')
        private readonly transactionRepository: TransactionRepository,
        @Inject('CustomerRepository')
        private readonly customerRepository: CustomerRepository,
        @Inject('PaymentStatusRepository')
        private readonly paymentStatusRepository: PaymentStatusRepository,
        @InjectDataSource()
        private readonly dataSource: DataSource,
        @Inject(APP_LOGGER_TOKEN)
        private readonly logger: IAppLogger,
    ) {}

    /**
     * Validate payment data
     */
    private validatePaymentData(data: {
        amount: number;
        currency: string;
        cardToken: string;
        merchantReference: string;
    }): void {
        // Validate amount
        if (data.amount < MIN_AMOUNT || data.amount > MAX_AMOUNT) {
            this.logger.warn(`[PaymentService] Payment validation failed: invalid amount: ${data.amount}`);
            throw new ValidationException(`Amount must be between ${MIN_AMOUNT} and ${MAX_AMOUNT}`);
        }

        // Validate currency
        const trimmedCurrency = data.currency.trim().toUpperCase();
        if (!trimmedCurrency || trimmedCurrency.length !== CURRENCY_CODE_LENGTH) {
            this.logger.warn(`[PaymentService] Payment validation failed: invalid currency: ${data.currency}`);
            throw new ValidationException(`Currency must be a valid 3-letter ISO code (e.g., USD, EUR)`);
        }

        // Validate card token
        const trimmedCardToken = data.cardToken.trim();
        if (!trimmedCardToken || trimmedCardToken.length < MIN_CARD_TOKEN_LENGTH) {
            this.logger.warn('[PaymentService] Payment validation failed: invalid card token');
            throw new ValidationException(`Card token must be at least ${MIN_CARD_TOKEN_LENGTH} characters`);
        }
        if (trimmedCardToken.length > MAX_CARD_TOKEN_LENGTH) {
            this.logger.warn('[PaymentService] Payment validation failed: card token too long');
            throw new ValidationException(`Card token must not exceed ${MAX_CARD_TOKEN_LENGTH} characters`);
        }

        // Validate merchant reference
        const trimmedMerchantReference = data.merchantReference.trim();
        if (!trimmedMerchantReference || trimmedMerchantReference.length < MIN_MERCHANT_REFERENCE_LENGTH) {
            this.logger.warn('[PaymentService] Payment validation failed: invalid merchant reference');
            throw new ValidationException(
                `Merchant reference must be at least ${MIN_MERCHANT_REFERENCE_LENGTH} characters`,
            );
        }
        if (trimmedMerchantReference.length > MAX_MERCHANT_REFERENCE_LENGTH) {
            this.logger.warn('[PaymentService] Payment validation failed: merchant reference too long');
            throw new ValidationException(
                `Merchant reference must not exceed ${MAX_MERCHANT_REFERENCE_LENGTH} characters`,
            );
        }
    }

    /**
     * Create a new payment
     */
    async createPayment(data: CreatePaymentData): Promise<Payment> {
        this.logger.log(`[PaymentService] Creating payment with merchant reference: ${data.merchantReference}`);

        // Validate payment data
        this.validatePaymentData({
            amount: data.amount,
            currency: data.currency,
            cardToken: data.cardToken,
            merchantReference: data.merchantReference,
        });

        // Validate customer exists
        const customer = await this.customerRepository.findById(data.customerId);
        if (!customer) {
            throw new EntityNotFoundException('Customer', data.customerId);
        }

        // Validate payment status exists
        const paymentStatus = await this.paymentStatusRepository.findById(data.paymentStatusId);
        if (!paymentStatus) {
            throw new EntityNotFoundException('PaymentStatus', data.paymentStatusId);
        }

        // Normalize data
        const paymentToCreate: CreatePaymentData = {
            amount: data.amount,
            currency: data.currency.trim().toUpperCase(),
            cardToken: data.cardToken.trim(),
            merchantReference: data.merchantReference.trim(),
            customerId: data.customerId,
            paymentStatusId: data.paymentStatusId,
            metadata: data.metadata || {},
        };

        const payment = await this.paymentRepository.create(paymentToCreate);
        this.logger.log(`[PaymentService] Payment created successfully with id: ${payment.id}`);

        return payment;
    }

    /**
     * Process payment (authorize + capture)
     */
    async processPayment(paymentId: string): Promise<Payment> {
        this.logger.log(`[PaymentService] Processing payment with id: ${paymentId}`);

        // Get payment
        const payment = await this.paymentRepository.findById(paymentId);
        if (!payment) {
            throw new EntityNotFoundException('Payment', paymentId);
        }

        // Get PENDING status to validate
        const pendingStatus = await this.paymentStatusRepository.findByName('PENDING');
        if (!pendingStatus) {
            throw new EntityNotFoundException('PaymentStatus', 'PENDING');
        }

        // Validate payment can be processed
        if (payment.paymentStatusId !== pendingStatus.id) {
            this.logger.warn(`[PaymentService] Payment ${paymentId} cannot be processed. Current status: ${payment.paymentStatusId}`);
            throw new ValidationException('Payment can only be processed when status is PENDING');
        }

        // Get PROCESSING status
        const processingStatus = await this.paymentStatusRepository.findByName('PROCESSING');
        if (!processingStatus) {
            throw new EntityNotFoundException('PaymentStatus', 'PROCESSING');
        }

        // Get CAPTURED status
        const capturedStatus = await this.paymentStatusRepository.findByName('CAPTURED');
        if (!capturedStatus) {
            throw new EntityNotFoundException('PaymentStatus', 'CAPTURED');
        }

        // Get AUTHORIZED status
        const authorizedStatus = await this.paymentStatusRepository.findByName('AUTHORIZED');
        if (!authorizedStatus) {
            throw new EntityNotFoundException('PaymentStatus', 'AUTHORIZED');
        }

        // Get FAILED status
        const failedStatus = await this.paymentStatusRepository.findByName('FAILED');
        if (!failedStatus) {
            throw new EntityNotFoundException('PaymentStatus', 'FAILED');
        }

        // Process payment in a transaction
        return await this.dataSource.transaction(async () => {
            // 1. Update payment status to PROCESSING
            payment.updateStatus(processingStatus.id);
            await this.paymentRepository.update(paymentId, { paymentStatusId: processingStatus.id });

            // 2. Authorize payment via gateway
            try {
                const authorizeRequest = {
                    amount: payment.amount,
                    currency: payment.currency,
                    cardToken: payment.cardToken,
                    merchantReference: payment.merchantReference,
                    metadata: payment.metadata,
                };

                const gatewayResponse = await this.paymentGateway.authorize(authorizeRequest);

                // Create authorization transaction
                const authorizationTransaction = Transaction.create({
                    paymentId: payment.id,
                    type: TransactionType.AUTHORIZATION,
                    amount: payment.amount,
                    status: gatewayResponse.success ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
                    gatewayResponse: gatewayResponse.rawResponse || {},
                    gatewayTransactionId: gatewayResponse.transactionId,
                });

                await this.transactionRepository.create({
                    paymentId: authorizationTransaction.paymentId,
                    type: authorizationTransaction.type,
                    amount: authorizationTransaction.amount,
                    status: authorizationTransaction.status,
                    gatewayResponse: authorizationTransaction.gatewayResponse,
                    gatewayTransactionId: authorizationTransaction.gatewayTransactionId,
                });

                if (!gatewayResponse.success) {
                    // Authorization failed
                    payment.updateStatus(failedStatus.id);
                    await this.paymentRepository.update(paymentId, { paymentStatusId: failedStatus.id });
                    throw new PaymentException(
                        gatewayResponse.errorMessage || 'Payment authorization failed',
                        gatewayResponse.errorMessage,
                        gatewayResponse.errorCode,
                    );
                }

                // 3. Update payment status to AUTHORIZED
                payment.updateStatus(authorizedStatus.id);
                await this.paymentRepository.update(paymentId, { paymentStatusId: authorizedStatus.id });

                // 4. Capture payment
                const captureResponse = await this.paymentGateway.capture(gatewayResponse.transactionId, payment.amount);

                // Create capture transaction
                const captureTransaction = Transaction.create({
                    paymentId: payment.id,
                    type: TransactionType.CAPTURE,
                    amount: payment.amount,
                    status: captureResponse.success ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
                    gatewayResponse: captureResponse.rawResponse || {},
                    gatewayTransactionId: captureResponse.transactionId,
                });

                await this.transactionRepository.create({
                    paymentId: captureTransaction.paymentId,
                    type: captureTransaction.type,
                    amount: captureTransaction.amount,
                    status: captureTransaction.status,
                    gatewayResponse: captureTransaction.gatewayResponse,
                    gatewayTransactionId: captureTransaction.gatewayTransactionId,
                });

                if (!captureResponse.success) {
                    // Capture failed
                    payment.updateStatus(failedStatus.id);
                    await this.paymentRepository.update(paymentId, { paymentStatusId: failedStatus.id });
                    throw new PaymentException(
                        captureResponse.errorMessage || 'Payment capture failed',
                        captureResponse.errorMessage,
                        captureResponse.errorCode,
                    );
                }

                // 5. Update payment status to CAPTURED
                payment.updateStatus(capturedStatus.id);
                await this.paymentRepository.update(paymentId, { paymentStatusId: capturedStatus.id });

                // Update metadata with gateway transaction IDs
                payment.updateMetadata({
                    authorizationTransactionId: gatewayResponse.transactionId,
                    captureTransactionId: captureResponse.transactionId,
                });
                await this.paymentRepository.update(paymentId, { metadata: payment.metadata });

                this.logger.log(`[PaymentService] Payment processed successfully: ${payment.id}`);
                return payment;
            } catch (error) {
                if (error instanceof PaymentException) {
                    throw error;
                }
                // Unexpected error
                this.logger.error(`[PaymentService] Unexpected error processing payment: ${error}`);
                payment.updateStatus(failedStatus.id);
                await this.paymentRepository.update(paymentId, { paymentStatusId: failedStatus.id });
                throw new PaymentException('Payment processing failed', error instanceof Error ? error.message : 'Unknown error');
            }
        });
    }

    /**
     * Refund payment
     */
    async refundPayment(paymentId: string, amount?: number): Promise<Payment> {
        this.logger.log(`[PaymentService] Refunding payment with id: ${paymentId}, amount: ${amount || 'full'}`);

        // Get payment
        const payment = await this.paymentRepository.findById(paymentId, true);
        if (!payment) {
            throw new EntityNotFoundException('Payment', paymentId);
        }

        // Get status entities to validate
        const capturedStatus = await this.paymentStatusRepository.findByName('CAPTURED');
        if (!capturedStatus) {
            throw new EntityNotFoundException('PaymentStatus', 'CAPTURED');
        }

        const partiallyRefundedStatus = await this.paymentStatusRepository.findByName('PARTIALLY_REFUNDED');
        if (!partiallyRefundedStatus) {
            throw new EntityNotFoundException('PaymentStatus', 'PARTIALLY_REFUNDED');
        }

        // Validate payment can be refunded
        if (payment.paymentStatusId !== capturedStatus.id && payment.paymentStatusId !== partiallyRefundedStatus.id) {
            this.logger.warn(`[PaymentService] Payment ${paymentId} cannot be refunded. Current status: ${payment.paymentStatusId}`);
            throw new ValidationException('Payment can only be refunded when status is CAPTURED or PARTIALLY_REFUNDED');
        }

        // Get REFUNDED status
        const refundedStatus = await this.paymentStatusRepository.findByName('REFUNDED');
        if (!refundedStatus) {
            throw new EntityNotFoundException('PaymentStatus', 'REFUNDED');
        }

        // Get transactions to find capture transaction
        const transactions = await this.transactionRepository.findByPaymentId(paymentId);
        const captureTransaction = transactions.find((t) => t.type === TransactionType.CAPTURE && t.status === TransactionStatus.SUCCESS);

        if (!captureTransaction || !captureTransaction.gatewayTransactionId) {
            throw new ValidationException('Cannot find capture transaction for this payment');
        }

        // Determine refund amount
        const refundAmount = amount || payment.amount;
        if (refundAmount <= 0 || refundAmount > payment.amount) {
            throw new ValidationException(`Refund amount must be between 0 and ${payment.amount}`);
        }

        // Process refund in a transaction
        return await this.dataSource.transaction(async () => {
            // Call gateway to refund
            const refundResponse = await this.paymentGateway.refund(captureTransaction.gatewayTransactionId || '', refundAmount);

            // Create refund transaction
            const refundTransaction = Transaction.create({
                paymentId: payment.id,
                type: TransactionType.REFUND,
                amount: refundAmount,
                status: refundResponse.success ? TransactionStatus.SUCCESS : TransactionStatus.FAILED,
                gatewayResponse: refundResponse.rawResponse || {},
                gatewayTransactionId: refundResponse.transactionId,
            });

            await this.transactionRepository.create({
                paymentId: refundTransaction.paymentId,
                type: refundTransaction.type,
                amount: refundTransaction.amount,
                status: refundTransaction.status,
                gatewayResponse: refundTransaction.gatewayResponse,
                gatewayTransactionId: refundTransaction.gatewayTransactionId,
            });

            if (!refundResponse.success) {
                throw new PaymentException(
                    refundResponse.errorMessage || 'Payment refund failed',
                    refundResponse.errorMessage,
                    refundResponse.errorCode,
                );
            }

            // Update payment status
            const isFullRefund = refundAmount === payment.amount;
            payment.updateStatus(isFullRefund ? refundedStatus.id : partiallyRefundedStatus.id);
            await this.paymentRepository.update(paymentId, {
                paymentStatusId: isFullRefund ? refundedStatus.id : partiallyRefundedStatus.id,
            });

            // Update metadata
            payment.updateMetadata({
                refundTransactionId: refundResponse.transactionId,
                refundAmount: refundAmount,
            });
            await this.paymentRepository.update(paymentId, { metadata: payment.metadata });

            this.logger.log(`[PaymentService] Payment refunded successfully: ${payment.id}`);
            return payment;
        });
    }

    /**
     * Get payment by ID with relations
     */
    async getPaymentById(id: string): Promise<Payment> {
        this.logger.log(`[PaymentService] Getting payment by id: ${id}`);

        const payment = await this.paymentRepository.findById(id, true);
        if (!payment) {
            this.logger.warn(`[PaymentService] Payment not found with id: ${id}`);
            throw new EntityNotFoundException('Payment', id);
        }

        this.logger.log(`[PaymentService] Payment found: ${payment.merchantReference}`);
        return payment;
    }

    /**
     * Get payments with pagination and filters
     */
    async getPaymentsWithPagination(
        page: number,
        limit: number,
        filters: PaymentFilters,
        sortBy?: string,
        sortOrder?: 'ASC' | 'DESC',
    ): Promise<{ payments: Payment[]; total: number }> {
        this.logger.log(`[PaymentService] Getting payments with pagination - page: ${page}, limit: ${limit}`);

        const result = await this.paymentRepository.findWithPagination(page, limit, filters, sortBy, sortOrder);

        this.logger.log(`[PaymentService] Found ${result.total} payments`);

        return result;
    }
}
