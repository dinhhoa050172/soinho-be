import { Module } from '@nestjs/common';
import { SlugService } from './slug-generator.service';

@Module({
  providers: [SlugService],
  exports: [SlugService],
})
export class SlugModule {}
