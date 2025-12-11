import { ApiProperty } from '@nestjs/swagger';

export class CreateCustomerResponseDto {
    @ApiProperty({
        description: 'Customer ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    id: string;

    @ApiProperty({
        description: 'Customer name',
        example: 'John Doe',
    })
    name: string;

    @ApiProperty({
        description: 'Customer email',
        example: 'john.doe@example.com',
    })
    email: string;

    @ApiProperty({
        description: 'Customer creation timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Customer last update timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    updatedAt: Date;
}
