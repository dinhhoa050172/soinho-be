import { PaginatedResponseDto } from 'src/libs/api/paginated.response.base';
import { MaterialResponseDto } from './material.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class MaterialPaginatedResponseDto extends PaginatedResponseDto<MaterialResponseDto> {
  @ApiProperty({ type: MaterialResponseDto, isArray: true })
  readonly data: readonly MaterialResponseDto[];

  constructor(props: {
    data: MaterialResponseDto[];
    page: number;
    limit: number;
    count: number;
  }) {
    super(props);
    this.data = props.data;
  }
}
