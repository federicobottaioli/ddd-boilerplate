import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, Min } from 'class-validator';
import { MIN_AMOUNT } from '../../domain/constants/payment.constants';

export class RefundPaymentRequestDto {
    @ApiPropertyOptional({
        description: 'Refund amount (if not provided, full refund)',
        example: 50.25,
        type: Number,
        minimum: MIN_AMOUNT,
    })
    @IsNumber()
    @IsOptional()
    @Min(MIN_AMOUNT, { message: `Amount must be at least ${MIN_AMOUNT}` })
    amount?: number;
}
