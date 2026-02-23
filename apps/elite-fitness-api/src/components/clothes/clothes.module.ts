import { Module } from '@nestjs/common';
import { ClothesResolver } from './clothes.resolver';
import { ClothesService } from './clothes.service';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { MemberModule } from '../member/member.module';
import { LikeModule } from '../like/like.module';
import ClothesSchema from '../../schemas/Clothes.model'

@Module({
  imports: [
    MongooseModule.forFeature([{name: "Clothes", schema: ClothesSchema}]),
    AuthModule, 
    ViewModule,
    MemberModule,
    LikeModule
  ],
  
  providers: [ClothesResolver, ClothesService],
  exports: [ClothesService, MongooseModule],
})
export class ClothesModule {}
