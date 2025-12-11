import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PaymentStatusService } from '../domain/services/payment-status.service';
import {
    CreatePaymentStatusRequestDto,
    CreatePaymentStatusResponseDto,
    UpdatePaymentStatusRequestDto,
    UpdatePaymentStatusResponseDto,
    GetPaymentStatusRequestDto,
    GetPaymentStatusResponseDto,
    GetPaymentStatusByIdResponseDto,
} from './dto';
import {
    CreatePaymentStatusMapper,
    GetPaymentStatusByIdMapper,
    UpdatePaymentStatusMapper,
    GetPaymentStatusMapper,
} from './mappers';

@ApiTags('Payment Status Management')
@Controller('payment-statuses')
export class PaymentStatusController {
    constructor(private readonly paymentStatusService: PaymentStatusService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new payment status',
        description: 'Creates a new payment status.',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Payment status created successfully',
        type: CreatePaymentStatusResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    })
    async createPaymentStatus(
        @Body() request: CreatePaymentStatusRequestDto,
    ): Promise<CreatePaymentStatusResponseDto> {
        const paymentStatus = await this.paymentStatusService.createPaymentStatus(request);
        return CreatePaymentStatusMapper.toResponse(paymentStatus);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all payment statuses with pagination',
        description: 'Retrieves payment statuses with pagination and optional filters.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Payment statuses retrieved successfully',
        type: GetPaymentStatusResponseDto,
    })
    async getAllPaymentStatuses(@Query() request: GetPaymentStatusRequestDto): Promise<GetPaymentStatusResponseDto> {
        const page = request.page || 1;
        const limit = request.limit || 10;
        const sortBy = request.sortBy || 'createdAt';
        const sortOrder = request.sortOrder || 'DESC';

        const result = await this.paymentStatusService.getPaymentStatusesWithPagination(
            page,
            limit,
            request.name,
            sortBy,
            sortOrder,
        );

        return GetPaymentStatusMapper.toResponse(result.paymentStatuses, page, limit, result.total);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get payment status by ID',
        description: 'Retrieves a specific payment status by ID.',
    })
    @ApiParam({
        name: 'id',
        description: 'Payment status ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Payment status retrieved successfully',
        type: GetPaymentStatusByIdResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Payment status not found',
    })
    async getPaymentStatusById(@Param('id') id: string): Promise<GetPaymentStatusByIdResponseDto> {
        const paymentStatus = await this.paymentStatusService.getPaymentStatusById(id);
        return GetPaymentStatusByIdMapper.toResponse(paymentStatus);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Update payment status',
        description: 'Updates a payment status by ID.',
    })
    @ApiParam({
        name: 'id',
        description: 'Payment status ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Payment status updated successfully',
        type: UpdatePaymentStatusResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Payment status not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    })
    async updatePaymentStatus(
        @Param('id') id: string,
        @Body() request: UpdatePaymentStatusRequestDto,
    ): Promise<UpdatePaymentStatusResponseDto> {
        const paymentStatus = await this.paymentStatusService.updatePaymentStatus(id, request);
        return UpdatePaymentStatusMapper.toResponse(paymentStatus);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Delete payment status',
        description: 'Deletes a payment status by ID.',
    })
    @ApiParam({
        name: 'id',
        description: 'Payment status ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Payment status deleted successfully',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Payment status not found',
    })
    async deletePaymentStatus(@Param('id') id: string): Promise<void> {
        await this.paymentStatusService.deletePaymentStatus(id);
    }
}
