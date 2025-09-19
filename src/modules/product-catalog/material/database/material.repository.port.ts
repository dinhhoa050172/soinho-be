import { RepositoryPort } from 'src/libs/ddd';
import { MaterialEntity } from '../domain/material.entity';

export type MaterialRepositoryPort = RepositoryPort<MaterialEntity>;
