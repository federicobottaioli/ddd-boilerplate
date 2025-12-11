import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, IsOptional, IsUUID, Min, Max, MinLength, MaxLength, IsObject } from 'class-validator';
import { MIN_AMOUNT, MAX_AMOUNT, MIN_CARD_TOKEN_LENGTH, MAX_CARD_TOKEN_LENGTH, MIN_MERCHANT_REFERENCE_LENGTH, MAX_MERCHANT_REFERENCE_LENGTH } from '../../domain/constants/payment.constants';

export class CreatePaymentRequestDto {
    @ApiProperty({
        description: 'Payment amount',
        example: 100.50,
        type: Number,
        minimum: MIN_AMOUNT,
        maximum: MAX_AMOUNT,
    })
    @IsNumber()
    @IsNotEmpty()
    @Min(MIN_AMOUNT, { message: `Amount must be at least ${MIN_AMOUNT}` })
    @Max(MAX_AMOUNT, { message: `Amount must not exceed ${MAX_AMOUNT}` })
    amount: number;

    @ApiProperty({
        description: 'Currency code (ISO 4217)',
        example: 'USD',
        type: String,
        minLength: 3,
        maxLength: 3,
    })
    @IsString()
    @IsNotEmpty()
    currency: string;

    @ApiProperty({
        description: 'Card token',
        example: 'tok_1234567890abcdef',
        type: String,
        minLength: MIN_CARD_TOKEN_LENGTH,
        maxLength: MAX_CARD_TOKEN_LENGTH,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(MIN_CARD_TOKEN_LENGTH, { message: `Card token must be at least ${MIN_CARD_TOKEN_LENGTH} characters` })
    @MaxLength(MAX_CARD_TOKEN_LENGTH, { message: `Card token must not exceed ${MAX_CARD_TOKEN_LENGTH} characters` })
    cardToken: string;

    @ApiProperty({
        description: 'Merchant reference',
        example: 'ORD-12345',
        type: String,
        minLength: MIN_MERCHANT_REFERENCE_LENGTH,
        maxLength: MAX_MERCHANT_REFERENCE_LENGTH,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(MIN_MERCHANT_REFERENCE_LENGTH, { message: `Merchant reference must be at least ${MIN_MERCHANT_REFERENCE_LENGTH} characters` })
    @MaxLength(MAX_MERCHANT_REFERENCE_LENGTH, { message: `Merchant reference must not exceed ${MAX_MERCHANT_REFERENCE_LENGTH} characters` })
    merchantReference: string;

    @ApiProperty({
        description: 'Customer ID',
        example: '550e8400-e29b-41d4-a716-446655440000',
        type: String,
    })
    @IsUUID()
    @IsNotEmpty()
    customerId: string;

    @ApiProperty({
        description: 'Payment status ID (should be PENDING for new payments)',
        example: '550e8400-e29b-41d4-a716-446655440000',
        type: String,
    })
    @IsUUID()
    @IsNotEmpty()
    paymentStatusId: string;

    @ApiPropertyOptional({
        description: 'Additional metadata',
        example: { orderId: '12345', source: 'web' },
        type: Object,
    })
    @IsObject()
    @IsOptional()
    metadata?: Record<string, unknown>;
}
