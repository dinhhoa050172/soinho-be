import { PaginatedResponseDto } from 'src/libs/api/paginated.response.base';
import { AddressResponseDto } from './address.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class AddressPaginatedResponseDto extends PaginatedResponseDto<AddressResponseDto> {
  @ApiProperty({ type: AddressResponseDto, isArray: true })
  readonly data: readonly AddressResponseDto[];

  constructor(props: {
    data: AddressResponseDto[];
    page: number;
    limit: number;
    count: number;
  }) {
    super(props);
    this.data = props.data;
  }
}
