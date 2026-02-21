import { Module } from '@nestjs/common';
import { EquipmentResolver } from './equipment.resolver';
import { EquipmentService } from './equipment.service';

@Module({
  providers: [EquipmentResolver, EquipmentService]
})
export class EquipmentModule {}
