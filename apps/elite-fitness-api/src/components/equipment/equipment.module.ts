import { Module } from '@nestjs/common';
import { EquipmentResolver } from './equipment.resolver';
import { EquipmentService } from './equipment.service';
import { MongooseModule } from '@nestjs/mongoose';
import EquipmentSchema from '../../schemas/Equipment.model';
import { AuthModule } from '../auth/auth.module';
import { ViewModule } from '../view/view.module';
import { MemberModule } from '../member/member.module';
import { LikeModule } from '../like/like.module';

@Module({
  imports: [
      MongooseModule.forFeature([{name: "Equipment", schema: EquipmentSchema}]),
      AuthModule, 
      ViewModule,
      MemberModule,
      LikeModule
    ],
  
  providers: [EquipmentResolver, EquipmentService],
  exports: [EquipmentService, MongooseModule],
})
export class EquipmentModule {}
