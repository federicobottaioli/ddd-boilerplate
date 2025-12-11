import { ApiProperty } from '@nestjs/swagger';
import PaginatedResponse from '@modules/shared/api/dto/paginated-response';
import { GetPaymentByIdResponseDto } from './get-payment-by-id.response.dto';

export class GetPaymentsResponseDto extends PaginatedResponse<GetPaymentByIdResponseDto> {}
