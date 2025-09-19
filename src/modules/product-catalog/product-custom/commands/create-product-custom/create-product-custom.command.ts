import { Prisma } from '@prisma/client';
import { Command, CommandProps } from 'src/libs/ddd';

export class CreateProductCustomCommand extends Command {
  readonly userId: number;
  readonly characterName: string;
  readonly characterDesign: string;
  readonly height?: Prisma.Decimal | null;
  readonly width?: Prisma.Decimal | null;
  readonly length?: Prisma.Decimal | null;
  readonly note?: string | null;
  readonly accessory?: string[];
  readonly images?: string[];
  readonly createdBy: string;

  constructor(props: CommandProps<CreateProductCustomCommand>) {
    super(props);
    Object.assign(this, props);
  }
}
