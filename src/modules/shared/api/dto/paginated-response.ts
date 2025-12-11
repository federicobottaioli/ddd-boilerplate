import { ApiProperty } from '@nestjs/swagger';

export default class PaginatedResponse<T> {
    @ApiProperty({ description: 'Array of items' })
    data: T[];

    @ApiProperty({ description: 'Current page number', example: 1 })
    page: number;

    @ApiProperty({ description: 'Number of items per page', example: 10 })
    limit: number;

    @ApiProperty({ description: 'Total number of items', example: 100 })
    total: number;

    @ApiProperty({ description: 'Total number of pages', example: 10 })
    totalPages: number;

    @ApiProperty({ description: 'Whether there is a next page', example: true })
    hasNext: boolean;

    @ApiProperty({ description: 'Whether there is a previous page', example: false })
    hasPrevious: boolean;

    constructor(
        data: T[],
        page: number,
        limit: number,
        total: number,
        totalPages: number,
        hasNext: boolean,
        hasPrevious: boolean,
    ) {
        this.data = data;
        this.page = page;
        this.limit = limit;
        this.total = total;
        this.totalPages = totalPages;
        this.hasNext = hasNext;
        this.hasPrevious = hasPrevious;
    }
}
