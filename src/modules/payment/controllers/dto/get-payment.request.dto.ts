import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsNumber } from 'class-validator';
import PaginationQuery from '@modules/shared/api/dto/pagination-query';

export class GetPaymentsRequestDto extends PaginationQuery {
    @ApiPropertyOptional({
        description: 'Filter by customer ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
        type: String,
    })
    @IsUUID()
    @IsOptional()
    customerId?: string;

    @ApiPropertyOptional({
        description: 'Filter by payment status ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
        type: String,
    })
    @IsUUID()
    @IsOptional()
    paymentStatusId?: string;

    @ApiPropertyOptional({
        description: 'Filter by merchant reference',
        example: 'ORD-12345',
        type: String,
    })
    @IsString()
    @IsOptional()
    merchantReference?: string;

    @ApiPropertyOptional({
        description: 'Filter by minimum amount',
        example: 10.0,
        type: Number,
    })
    @IsNumber()
    @IsOptional()
    minAmount?: number;

    @ApiPropertyOptional({
        description: 'Filter by maximum amount',
        example: 1000.0,
        type: Number,
    })
    @IsNumber()
    @IsOptional()
    maxAmount?: number;

    @ApiPropertyOptional({
        description: 'Filter by currency',
        example: 'USD',
        type: String,
    })
    @IsString()
    @IsOptional()
    currency?: string;
}
