import { Module } from '@nestjs/common';
import { MemberModule } from './member/member.module';
import { PropertyModule } from './property/property.module';
import { AuthModule } from './auth/auth.module';
import { CommentModule } from './comment/comment.module';
import { LikeModule } from './like/like.module';
import { FollowModule } from './follow/follow.module';
import { BoardArticleModule } from './board-article/board-article.module';
import { ViewModule } from './view/view.module';
import { ProductModule } from './product/product.module';
import { ClothesModule } from './clothes/clothes.module';
import { EquipmentModule } from './equipment/equipment.module';
import { CsModule } from './cs/cs.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    MemberModule,
    AuthModule,
    PropertyModule,
    BoardArticleModule,
    LikeModule,
    ViewModule,
    CommentModule,
    FollowModule,
    ProductModule,
    ClothesModule,
    EquipmentModule,
    CsModule,
    OrderModule,
  ]
})
export class ComponentsModule {}
