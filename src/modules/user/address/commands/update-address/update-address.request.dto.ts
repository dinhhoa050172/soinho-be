import { PartialType } from '@nestjs/swagger';
import { CreateAddressRequestDto } from '../create-address/create-address.request.dto';

export class UpdateAddressRequestDto extends PartialType(
  CreateAddressRequestDto,
) {}
