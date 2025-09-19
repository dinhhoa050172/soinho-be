import { PaginatedResponseDto } from 'src/libs/api/paginated.response.base';
import { TransactionResponseDto } from './transaction.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class TransactionPaginatedResponseDto extends PaginatedResponseDto<TransactionResponseDto> {
  @ApiProperty({ type: TransactionResponseDto, isArray: true })
  readonly data: readonly TransactionResponseDto[];

  constructor(props: {
    data: TransactionResponseDto[];
    page: number;
    limit: number;
    count: number;
  }) {
    super(props);
    this.data = props.data;
  }
}
