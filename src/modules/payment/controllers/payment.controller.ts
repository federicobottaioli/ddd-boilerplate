import { Controller, Get, Post, Put, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentService } from '../domain/services/payment.service';
import {
    CreatePaymentRequestDto,
    CreatePaymentResponseDto,
    ProcessPaymentResponseDto,
    RefundPaymentRequestDto,
    RefundPaymentResponseDto,
    GetPaymentsRequestDto,
    GetPaymentsResponseDto,
    GetPaymentByIdResponseDto,
} from './dto';
import {
    CreatePaymentMapper,
    ProcessPaymentMapper,
    RefundPaymentMapper,
    GetPaymentByIdMapper,
    GetPaymentsMapper,
} from './mappers';

@ApiTags('Payment Management')
@Controller('payments')
export class PaymentController {
    constructor(private readonly paymentService: PaymentService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new payment',
        description: 'Creates a new payment in PENDING status.',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Payment created successfully',
        type: CreatePaymentResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    })
    async createPayment(@Body() request: CreatePaymentRequestDto): Promise<CreatePaymentResponseDto> {
        const payment = await this.paymentService.createPayment(request);
        return CreatePaymentMapper.toResponse(payment);
    }

    @Post(':id/process')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Process a payment',
        description: 'Processes a payment by authorizing and capturing it. Payment must be in PENDING status.',
    })
    @ApiParam({
        name: 'id',
        description: 'Payment ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Payment processed successfully',
        type: ProcessPaymentResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Payment cannot be processed',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Payment not found',
    })
    async processPayment(@Param('id') id: string): Promise<ProcessPaymentResponseDto> {
        const payment = await this.paymentService.processPayment(id);
        return ProcessPaymentMapper.toResponse(payment);
    }

    @Post(':id/refund')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({
        summary: 'Refund a payment',
        description: 'Refunds a payment (full or partial). Payment must be in CAPTURED or PARTIALLY_REFUNDED status.',
    })
    @ApiParam({
        name: 'id',
        description: 'Payment ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Payment refunded successfully',
        type: RefundPaymentResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Payment cannot be refunded',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Payment not found',
    })
    async refundPayment(
        @Param('id') id: string,
        @Body() request: RefundPaymentRequestDto,
    ): Promise<RefundPaymentResponseDto> {
        const payment = await this.paymentService.refundPayment(id, request.amount);
        return RefundPaymentMapper.toResponse(payment);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all payments with pagination and filters',
        description: 'Retrieves payments with pagination and optional filters.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Payments retrieved successfully',
        type: GetPaymentsResponseDto,
    })
    async getAllPayments(@Query() request: GetPaymentsRequestDto): Promise<GetPaymentsResponseDto> {
        const page = request.page || 1;
        const limit = request.limit || 10;
        const sortBy = request.sortBy || 'createdAt';
        const sortOrder = request.sortOrder || 'DESC';

        const filters = {
            customerId: request.customerId,
            paymentStatusId: request.paymentStatusId,
            merchantReference: request.merchantReference,
            minAmount: request.minAmount,
            maxAmount: request.maxAmount,
            currency: request.currency,
        };

        const result = await this.paymentService.getPaymentsWithPagination(page, limit, filters, sortBy, sortOrder);

        return GetPaymentsMapper.toResponse(result.payments, page, limit, result.total);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get payment by ID',
        description: 'Retrieves a specific payment by ID with all relations and transactions.',
    })
    @ApiParam({
        name: 'id',
        description: 'Payment ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Payment retrieved successfully',
        type: GetPaymentByIdResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Payment not found',
    })
    async getPaymentById(@Param('id') id: string): Promise<GetPaymentByIdResponseDto> {
        const payment = await this.paymentService.getPaymentById(id);
        return GetPaymentByIdMapper.toResponse(payment);
    }
}
