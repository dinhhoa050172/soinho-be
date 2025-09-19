import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateRoleCommand } from './create-role.command';
import { Err, Ok, Result } from 'oxide.ts';
import { RoleEntity } from '../../domain/role.entity';
import { ConflictException, Inject } from '@nestjs/common';
import { RoleRepositoryPort } from '../../database/role.repository.port';
import { ROLE_REPOSITORY } from '../../role.di-tokens';
import { RoleAlreadyInUseError } from '../../domain/role.error';

export type CreateRoleServiceResult = Result<RoleEntity, any>;

@CommandHandler(CreateRoleCommand)
export class CreateRoleService implements ICommandHandler<CreateRoleCommand> {
  constructor(
    @Inject(ROLE_REPOSITORY)
    protected readonly roleRepo: RoleRepositoryPort,
  ) {}

  async execute(command: CreateRoleCommand): Promise<CreateRoleServiceResult> {
    const role = RoleEntity.create({
      ...command.getExtendedProps<CreateRoleCommand>(),
    });

    try {
      const createdRole = await this.roleRepo.insert(role);
      return Ok(createdRole);
    } catch (error: any) {
      if (error instanceof ConflictException) {
        return Err(new RoleAlreadyInUseError(error));
      }
      throw error;
    }
  }
}
