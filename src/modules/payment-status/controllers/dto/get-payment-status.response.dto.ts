import { ApiProperty } from '@nestjs/swagger';
import PaginatedResponse from '@modules/shared/api/dto/paginated-response';
import { GetPaymentStatusByIdResponseDto } from './get-payment-status-by-id.response.dto';

export class GetPaymentStatusResponseDto extends PaginatedResponse<GetPaymentStatusByIdResponseDto> {}
