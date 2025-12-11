import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import PaginationQuery from '@modules/shared/api/dto/pagination-query';

export class GetCustomersRequestDto extends PaginationQuery {
    @ApiPropertyOptional({
        description: 'Filter by customer name',
        example: 'John',
        type: String,
    })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({
        description: 'Filter by customer email',
        example: 'john@example.com',
        type: String,
    })
    @IsString()
    @IsOptional()
    email?: string;
}
