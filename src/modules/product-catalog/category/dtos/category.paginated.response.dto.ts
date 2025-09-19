import { PaginatedResponseDto } from 'src/libs/api/paginated.response.base';
import { CategoryResponseDto } from './category.response.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryPaginatedResponseDto extends PaginatedResponseDto<CategoryResponseDto> {
  @ApiProperty({ type: CategoryResponseDto, isArray: true })
  readonly data: readonly CategoryResponseDto[];

  constructor(props: {
    data: CategoryResponseDto[];
    page: number;
    limit: number;
    count: number;
  }) {
    super(props);
    this.data = props.data;
  }
}
