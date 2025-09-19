import { Injectable } from '@nestjs/common';
import slugify from 'slugify';

@Injectable()
export class SlugService {
  generate(base: string): string {
    return slugify(base, { lower: true, locale: 'vi' });
  }

  async generateUnique(
    base: string,
    existingChecker: (slug: string) => Promise<boolean>,
  ): Promise<string> {
    const baseSlug = this.generate(base);
    let currentSlug = baseSlug;
    let counter = 1;

    while (await existingChecker(currentSlug)) {
      currentSlug = `${baseSlug}-${counter++}`;
    }

    return currentSlug;
  }
}
