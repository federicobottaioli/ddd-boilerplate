import PaginatedResponse from '@modules/shared/api/dto/paginated-response';
import { GetCustomerByIdResponseDto } from './get-customer-by-id.response.dto';

export class GetCustomersResponseDto extends PaginatedResponse<GetCustomerByIdResponseDto> {}
