import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsEmail, MinLength, MaxLength } from 'class-validator';
import { MIN_NAME_LENGTH, MAX_NAME_LENGTH, MAX_EMAIL_LENGTH } from '../../domain/constants/customer.constants';

export class CreateCustomerRequestDto {
    @ApiProperty({
        description: 'Customer name',
        example: 'John Doe',
        type: String,
        minLength: MIN_NAME_LENGTH,
        maxLength: MAX_NAME_LENGTH,
    })
    @IsString()
    @IsNotEmpty()
    @MinLength(MIN_NAME_LENGTH, { message: 'Customer name must be at least 2 characters' })
    @MaxLength(MAX_NAME_LENGTH, { message: `Customer name must not exceed ${MAX_NAME_LENGTH} characters` })
    name: string;

    @ApiProperty({
        description: 'Customer email',
        example: 'john.doe@example.com',
        type: String,
        maxLength: MAX_EMAIL_LENGTH,
    })
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @MaxLength(MAX_EMAIL_LENGTH, { message: `Email must not exceed ${MAX_EMAIL_LENGTH} characters` })
    email: string;
}
