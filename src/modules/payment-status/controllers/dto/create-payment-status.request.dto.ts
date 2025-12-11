import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator';
import { MIN_NAME_LENGTH, MAX_NAME_LENGTH, MAX_DESCRIPTION_LENGTH } from '../../domain/constants/payment-status.constants';

export class CreatePaymentStatusRequestDto {
    @ApiProperty({
        description: 'Payment status name',
        example: 'PENDING',
        type: String,
        minLength: MIN_NAME_LENGTH,
        maxLength: MAX_NAME_LENGTH,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(MIN_NAME_LENGTH, { message: 'Payment status name must be at least 2 characters' })
    @MaxLength(MAX_NAME_LENGTH, { message: 'Payment status name must not exceed 100 characters' })
    name: string;

    @ApiProperty({
        description: 'Payment status description',
        example: 'Payment is pending processing',
        type: String,
        required: false,
    })
    @IsString()
    @IsOptional()
    @MaxLength(MAX_DESCRIPTION_LENGTH, { message: `Description must not exceed ${MAX_DESCRIPTION_LENGTH} characters` })
    description?: string;
}
