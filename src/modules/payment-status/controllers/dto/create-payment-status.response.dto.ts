import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentStatusResponseDto {
    @ApiProperty({
        description: 'Payment status ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    id: string;

    @ApiProperty({
        description: 'Payment status name',
        example: 'PENDING',
    })
    name: string;

    @ApiProperty({
        description: 'Payment status description',
        example: 'Payment is pending processing',
    })
    description: string;

    @ApiProperty({
        description: 'Payment status creation timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Payment status last update timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    updatedAt: Date;
}
