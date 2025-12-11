import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEmail, MinLength, MaxLength } from 'class-validator';
import { MIN_NAME_LENGTH, MAX_NAME_LENGTH, MAX_EMAIL_LENGTH } from '../../domain/constants/customer.constants';

export class UpdateCustomerRequestDto {
    @ApiPropertyOptional({
        description: 'Customer name',
        example: 'Jane Doe',
        type: String,
        minLength: MIN_NAME_LENGTH,
        maxLength: MAX_NAME_LENGTH,
    })
    @IsString()
    @IsOptional()
    @MinLength(MIN_NAME_LENGTH, { message: 'Customer name must be at least 2 characters' })
    @MaxLength(MAX_NAME_LENGTH, { message: `Customer name must not exceed ${MAX_NAME_LENGTH} characters` })
    name?: string;

    @ApiPropertyOptional({
        description: 'Customer email',
        example: 'jane.doe@example.com',
        type: String,
    })
    @IsString()
    @IsOptional()
    @IsEmail()
    @MaxLength(MAX_EMAIL_LENGTH, { message: `Email must not exceed ${MAX_EMAIL_LENGTH} characters` })
    email?: string;
}
