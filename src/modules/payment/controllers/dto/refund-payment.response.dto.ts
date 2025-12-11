import { ApiProperty } from '@nestjs/swagger';

export class RefundPaymentResponseDto {
    @ApiProperty({
        description: 'Payment ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    id: string;

    @ApiProperty({
        description: 'Payment amount',
        example: 100.50,
    })
    amount: number;

    @ApiProperty({
        description: 'Currency code',
        example: 'USD',
    })
    currency: string;

    @ApiProperty({
        description: 'Merchant reference',
        example: 'ORD-12345',
    })
    merchantReference: string;

    @ApiProperty({
        description: 'Payment status ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
    })
    paymentStatusId: string;

    @ApiProperty({
        description: 'Payment creation timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    createdAt: Date;

    @ApiProperty({
        description: 'Payment last update timestamp',
        example: '2024-01-01T00:00:00Z',
    })
    updatedAt: Date;
}
