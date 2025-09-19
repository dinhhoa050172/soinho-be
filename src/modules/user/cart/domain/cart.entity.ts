import { AggregateRoot } from 'src/libs/ddd';
import { Err, Ok, Result } from 'oxide.ts';
import { CartProps, CreateCartProps } from './cart.type';
import { CartAlreadyInUseError } from './cart.error';
import { Prisma } from '@prisma/client';

export class CartEntity extends AggregateRoot<CartProps, bigint> {
  static create(props: CreateCartProps): CartEntity {
    return new CartEntity({
      id: BigInt(0),
      props: {
        ...props,
        items: props.items ?? [],
      },
    });
  }

  addItem(productId: bigint, quantity: number, price: Prisma.Decimal): void {
    const existing = this.props.items.find(
      (item) => item.productId === productId,
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      this.props.items.push({ productId, quantity, price });
    }
  }

  removeItem(productId: bigint): void {
    this.props.items = this.props.items.filter(
      (item) => item.productId !== productId,
    );
  }

  clearItems(): void {
    this.props.items = [];
  }

  updateItemQuantity(productId: bigint, quantity: number): void {
    const item = this.props.items.find((i) => i.productId === productId);
    if (!item) return;

    if (quantity <= 0) {
      this.removeItem(productId);
    } else {
      item.quantity = quantity;
    }
  }

  delete(): Result<unknown, CartAlreadyInUseError> {
    if (this.props.inUseCount) {
      return Err(new CartAlreadyInUseError());
    }
    return Ok(true);
    // Entity business rules validation
  }

  public validate(): void {}
}
