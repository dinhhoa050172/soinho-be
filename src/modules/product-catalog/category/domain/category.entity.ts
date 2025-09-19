import { AggregateRoot } from 'src/libs/ddd';
import { copyNonUndefinedProps } from 'src/libs/utils/copy-non-undefined-props.util';
import { Ok, Result } from 'oxide.ts';
import {
  CategoryProps,
  CreateCategoryProps,
  UpdateCategoryProps,
} from './category.type';

export class CategoryEntity extends AggregateRoot<CategoryProps, bigint> {
  static create(props: CreateCategoryProps): CategoryEntity {
    return new CategoryEntity({
      id: BigInt(0),
      props: {
        ...props,
      },
    });
  }

  update(props: UpdateCategoryProps): Result<unknown, any> {
    copyNonUndefinedProps(this.props, props);
    return Ok(true);
  }

  public validate(): void {}
}
