import { Module } from '@nestjs/common';
import { CommentResolver } from './comment.resolver';
import { CommentService } from './comment.service';
import CommentSchema from '../../schemas/Comment.model';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { MemberModule } from '../member/member.module';
import { BoardArticleModule } from '../board-article/board-article.module';
import { PropertyModule } from '../property/property.module';
import { ProductModule } from '../product/product.module';
import { EquipmentModule } from '../equipment/equipment.module';
import { ClothesModule } from '../clothes/clothes.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: "Comment", 
        schema: CommentSchema
      }
    ]),
    AuthModule, 
    ViewModule,
    MemberModule,
    BoardArticleModule,
    PropertyModule,
    ProductModule,
    EquipmentModule,
    ClothesModule
  ],
  providers: [CommentResolver, CommentService],
  exports: [CommentService],
})
export class CommentModule {}
