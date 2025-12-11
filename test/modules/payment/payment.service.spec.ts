import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '@modules/payment/domain/services/payment.service';
import { PaymentRepository } from '@modules/payment/domain/repositories/payment.repository';
import { PaymentGatewayPort } from '@modules/payment/domain/ports/payment-gateway.port';
import { TransactionRepository } from '@modules/transaction/domain/repositories/transaction.repository';
import { CustomerRepository } from '@modules/customer/domain/repositories/customer.repository';
import { PaymentStatusRepository } from '@modules/payment-status/domain/repositories/payment-status.repository';
import { DataSource } from 'typeorm';
import { APP_LOGGER_TOKEN } from '@modules/shared/application/interfaces/app-logger';
import { Payment, PaymentStatusEnum } from '@modules/payment/domain/entities/payment';
import { Customer } from '@modules/customer/domain/entities/customer';
import { PaymentStatus } from '@modules/payment-status/domain/entities/payment-status';
import { EntityNotFoundException, ValidationException } from '@modules/shared/domain/exceptions';

describe('PaymentService', () => {
    let service: PaymentService;
    let paymentRepository: jest.Mocked<PaymentRepository>;
    let paymentGateway: jest.Mocked<PaymentGatewayPort>;
    let transactionRepository: jest.Mocked<TransactionRepository>;
    let customerRepository: jest.Mocked<CustomerRepository>;
    let paymentStatusRepository: jest.Mocked<PaymentStatusRepository>;
    let dataSource: jest.Mocked<DataSource>;
    let logger: jest.Mocked<any>;

    beforeEach(async () => {
        const mockPaymentRepository = {
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findWithPagination: jest.fn(),
        };

        const mockPaymentGateway = {
            authorize: jest.fn(),
            capture: jest.fn(),
            refund: jest.fn(),
            getStatus: jest.fn(),
        };

        const mockTransactionRepository = {
            findById: jest.fn(),
            findByPaymentId: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        };

        const mockCustomerRepository = {
            findById: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findWithPagination: jest.fn(),
        };

        const mockPaymentStatusRepository = {
            findById: jest.fn(),
            findByName: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            findWithPagination: jest.fn(),
        };

        const mockDataSource = {
            transaction: jest.fn(),
        };

        const mockLogger = {
            log: jest.fn(),
            error: jest.fn(),
            warn: jest.fn(),
            debug: jest.fn(),
        };

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentService,
                {
                    provide: 'PaymentRepository',
                    useValue: mockPaymentRepository,
                },
                {
                    provide: 'PaymentGatewayPort',
                    useValue: mockPaymentGateway,
                },
                {
                    provide: 'TransactionRepository',
                    useValue: mockTransactionRepository,
                },
                {
                    provide: 'CustomerRepository',
                    useValue: mockCustomerRepository,
                },
                {
                    provide: 'PaymentStatusRepository',
                    useValue: mockPaymentStatusRepository,
                },
                {
                    provide: DataSource,
                    useValue: mockDataSource,
                },
                {
                    provide: APP_LOGGER_TOKEN,
                    useValue: mockLogger,
                },
            ],
        }).compile();

        service = module.get<PaymentService>(PaymentService);
        paymentRepository = module.get('PaymentRepository');
        paymentGateway = module.get('PaymentGatewayPort');
        transactionRepository = module.get('TransactionRepository');
        customerRepository = module.get('CustomerRepository');
        paymentStatusRepository = module.get('PaymentStatusRepository');
        dataSource = module.get(DataSource);
        logger = module.get(APP_LOGGER_TOKEN);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createPayment', () => {
        it('should create a payment successfully', async () => {
            const customer = new Customer('customer-id', 'John Doe', 'john@example.com', new Date(), new Date());
            const paymentStatus = new PaymentStatus('status-id', 'PENDING', 'Pending', new Date(), new Date());

            customerRepository.findById.mockResolvedValue(customer);
            paymentStatusRepository.findById.mockResolvedValue(paymentStatus);

            const paymentData = {
                amount: 100.0,
                currency: 'USD',
                cardToken: 'tok_1234567890',
                merchantReference: 'ORD-12345',
                customerId: 'customer-id',
                paymentStatusId: 'status-id',
            };

            const createdPayment = Payment.create({
                ...paymentData,
                metadata: {},
            });
            createdPayment.id = 'payment-id';

            paymentRepository.create.mockResolvedValue(createdPayment);

            const result = await service.createPayment(paymentData);

            expect(result).toBeDefined();
            expect(result.amount).toBe(100.0);
            expect(paymentRepository.create).toHaveBeenCalled();
        });

        it('should throw EntityNotFoundException if customer does not exist', async () => {
            customerRepository.findById.mockResolvedValue(null);

            const paymentData = {
                amount: 100.0,
                currency: 'USD',
                cardToken: 'tok_1234567890',
                merchantReference: 'ORD-12345',
                customerId: 'non-existent-id',
                paymentStatusId: 'status-id',
            };

            await expect(service.createPayment(paymentData)).rejects.toThrow(EntityNotFoundException);
        });
    });

    describe('processPayment', () => {
        it('should process payment successfully', async () => {
            const payment = Payment.create({
                amount: 100.0,
                currency: 'USD',
                cardToken: 'tok_1234567890',
                merchantReference: 'ORD-12345',
                customerId: 'customer-id',
                paymentStatusId: 'pending-status-id',
                metadata: {},
            });
            payment.id = 'payment-id';

            const pendingStatus = new PaymentStatus('pending-status-id', 'PENDING', 'Pending', new Date(), new Date());
            const processingStatus = new PaymentStatus('processing-status-id', 'PROCESSING', 'Processing', new Date(), new Date());
            const authorizedStatus = new PaymentStatus('authorized-status-id', 'AUTHORIZED', 'Authorized', new Date(), new Date());
            const capturedStatus = new PaymentStatus('captured-status-id', 'CAPTURED', 'Captured', new Date(), new Date());

            paymentRepository.findById.mockResolvedValue(payment);
            paymentStatusRepository.findByName
                .mockResolvedValueOnce(pendingStatus)
                .mockResolvedValueOnce(processingStatus)
                .mockResolvedValueOnce(authorizedStatus)
                .mockResolvedValueOnce(capturedStatus);

            paymentGateway.authorize.mockResolvedValue({
                success: true,
                transactionId: 'auth-txn-id',
                status: 'AUTHORIZED',
                rawResponse: {},
            });

            paymentGateway.capture.mockResolvedValue({
                success: true,
                transactionId: 'capture-txn-id',
                status: 'CAPTURED',
                rawResponse: {},
            });

            dataSource.transaction.mockImplementation(async (callback) => {
                return callback({
                    // Transaction context
                });
            });

            paymentRepository.update.mockResolvedValue(payment);
            transactionRepository.create.mockResolvedValue({
                id: 'txn-id',
                paymentId: 'payment-id',
                type: 'AUTHORIZATION' as any,
                amount: 100.0,
                status: 'SUCCESS' as any,
                gatewayResponse: {},
                gatewayTransactionId: 'auth-txn-id',
                createdAt: new Date(),
                updatedAt: new Date(),
            });

            const result = await service.processPayment('payment-id');

            expect(result).toBeDefined();
            expect(paymentGateway.authorize).toHaveBeenCalled();
            expect(paymentGateway.capture).toHaveBeenCalled();
        });

        it('should throw ValidationException if payment cannot be processed', async () => {
            const payment = Payment.create({
                amount: 100.0,
                currency: 'USD',
                cardToken: 'tok_1234567890',
                merchantReference: 'ORD-12345',
                customerId: 'customer-id',
                paymentStatusId: 'captured-status-id', // Already captured
                metadata: {},
            });
            payment.id = 'payment-id';

            paymentRepository.findById.mockResolvedValue(payment);

            await expect(service.processPayment('payment-id')).rejects.toThrow(ValidationException);
        });
    });
});
