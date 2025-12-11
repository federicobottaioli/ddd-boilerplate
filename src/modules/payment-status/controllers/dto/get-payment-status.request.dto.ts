import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import PaginationQuery from '@modules/shared/api/dto/pagination-query';

export class GetPaymentStatusRequestDto extends PaginationQuery {
    @ApiPropertyOptional({
        description: 'Filter by payment status name',
        example: 'PENDING',
        type: String,
    })
    @IsString()
    @IsOptional()
    name?: string;
}
