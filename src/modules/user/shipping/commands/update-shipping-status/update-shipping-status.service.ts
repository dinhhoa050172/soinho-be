// import { Err, Ok, Result } from 'oxide.ts';
// import { Inject } from '@nestjs/common';
// import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
// import { ConflictException } from 'src/libs/exceptions';
// import { UpdateShippingStatusCommand } from './update-shipping-status.command';
// import { ShippingRepositoryPort } from '../../database/shipping.repository.port';
// import { ShippingEntity } from '../../domain/shipping.entity';
// import { ShippingNotFoundError, ShippingAlreadyInUseError } from '../../domain/shipping.error';
// import { SHIPPING_REPOSITORY } from '../../shipping.di-tokens';

// export type UpdateShippingStatusServiceResult = Result<
//   ShippingEntity,
//   ShippingNotFoundError | ShippingAlreadyInUseError
// >;

// @CommandHandler(UpdateShippingStatusCommand)
// export class UpdateShippingStatusService
//   implements ICommandHandler<UpdateShippingStatusCommand>
// {
//   constructor(
//     @Inject(SHIPPING_REPOSITORY)
//     protected readonly ShippingRepo: ShippingRepositoryPort,
//   ) {}

//   async execute(
//     command: UpdateShippingStatusCommand,
//   ): Promise<UpdateShippingStatusServiceResult> {
//     let updatedOldDefaultShipping: ShippingEntity | undefined;
//     const found = await this.ShippingRepo.findOneById(command.ShippingId);
//     if (found.isNone()) {
//       return Err(new ShippingNotFoundError());
//     }

//     const Shipping = found.unwrap();
//     const updatedShipping = Shipping.update({
//       ...command.getExtendedProps<UpdateShippingStatusCommand>(),
//     });

//     if (updatedShipping.isErr()) {
//       return Err(updatedShipping.unwrapErr());
//     }

//     try {
//       const updatedProduct = await this.ShippingRepo.update(Shipping);
//       if (updatedOldDefaultShipping) {
//         await this.ShippingRepo.update(updatedOldDefaultShipping);
//       }
//       return Ok(updatedProduct);
//     } catch (error: any) {
//       if (error instanceof ConflictException) {
//         return Err(new ShippingAlreadyInUseError(error));
//       }
//       throw error;
//     }
//   }
// }
