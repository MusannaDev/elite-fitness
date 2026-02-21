import { Module } from '@nestjs/common';
import { ClothesResolver } from './clothes.resolver';
import { ClothesService } from './clothes.service';

@Module({
  providers: [ClothesResolver, ClothesService]
})
export class ClothesModule {}
