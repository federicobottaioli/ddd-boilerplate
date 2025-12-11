import { Controller, Get, Post, Put, Delete, Body, Param, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CustomerService } from '../domain/services/customer.service';
import {
    CreateCustomerRequestDto,
    CreateCustomerResponseDto,
    UpdateCustomerRequestDto,
    UpdateCustomerResponseDto,
    GetCustomersRequestDto,
    GetCustomersResponseDto,
    GetCustomerByIdResponseDto,
} from './dto';
import {
    CreateCustomerMapper,
    GetCustomerByIdMapper,
    UpdateCustomerMapper,
    GetCustomersMapper,
} from './mappers';

@ApiTags('Customer Management')
@Controller('customers')
export class CustomerController {
    constructor(private readonly customerService: CustomerService) {}

    @Post()
    @HttpCode(HttpStatus.CREATED)
    @ApiOperation({
        summary: 'Create a new customer',
        description: 'Creates a new customer.',
    })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'Customer created successfully',
        type: CreateCustomerResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    })
    async createCustomer(@Body() request: CreateCustomerRequestDto): Promise<CreateCustomerResponseDto> {
        const customer = await this.customerService.createCustomer(request);
        return CreateCustomerMapper.toResponse(customer);
    }

    @Get()
    @ApiOperation({
        summary: 'Get all customers with pagination',
        description: 'Retrieves customers with pagination and optional filters.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Customers retrieved successfully',
        type: GetCustomersResponseDto,
    })
    async getAllCustomers(@Query() request: GetCustomersRequestDto): Promise<GetCustomersResponseDto> {
        const page = request.page || 1;
        const limit = request.limit || 10;
        const sortBy = request.sortBy || 'createdAt';
        const sortOrder = request.sortOrder || 'DESC';

        const result = await this.customerService.getCustomersWithPagination(
            page,
            limit,
            request.name,
            request.email,
            sortBy,
            sortOrder,
        );

        return GetCustomersMapper.toResponse(result.customers, page, limit, result.total);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get customer by ID',
        description: 'Retrieves a specific customer by ID.',
    })
    @ApiParam({
        name: 'id',
        description: 'Customer ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Customer retrieved successfully',
        type: GetCustomerByIdResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Customer not found',
    })
    async getCustomerById(@Param('id') id: string): Promise<GetCustomerByIdResponseDto> {
        const customer = await this.customerService.getCustomerById(id);
        return GetCustomerByIdMapper.toResponse(customer);
    }

    @Put(':id')
    @ApiOperation({
        summary: 'Update customer',
        description: 'Updates a customer by ID.',
    })
    @ApiParam({
        name: 'id',
        description: 'Customer ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Customer updated successfully',
        type: UpdateCustomerResponseDto,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Customer not found',
    })
    @ApiResponse({
        status: HttpStatus.BAD_REQUEST,
        description: 'Invalid input data',
    })
    async updateCustomer(
        @Param('id') id: string,
        @Body() request: UpdateCustomerRequestDto,
    ): Promise<UpdateCustomerResponseDto> {
        const customer = await this.customerService.updateCustomer(id, request);
        return UpdateCustomerMapper.toResponse(customer);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({
        summary: 'Delete customer',
        description: 'Deletes a customer by ID.',
    })
    @ApiParam({
        name: 'id',
        description: 'Customer ID',
        type: String,
    })
    @ApiResponse({
        status: HttpStatus.NO_CONTENT,
        description: 'Customer deleted successfully',
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        description: 'Customer not found',
    })
    async deleteCustomer(@Param('id') id: string): Promise<void> {
        await this.customerService.deleteCustomer(id);
    }
}
