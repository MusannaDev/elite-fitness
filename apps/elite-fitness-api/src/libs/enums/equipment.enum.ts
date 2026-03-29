import { registerEnumType } from '@nestjs/graphql';

export enum EquipmentCategory {
  MACHINES = "MACHINES",
  STRENGTH = "STRENGTH",
  ACCESSORIES = "ACCESSORIES",
  CARDIO = "CARDIO",
  OTHER = "OTHER"
}
registerEnumType(EquipmentCategory, {
  name: 'EquipmentCategory',
});

export enum EquipmentStatus {
  ACTIVE = "ACTIVE",
  SOLD = "SOLD",
  DELETE = "DELETE",
}
registerEnumType(EquipmentStatus, {
  name: 'EquipmentStatus',
});

export enum EquipmentMaterial {
  STEEL = "STEEL",
  IRON = "IRON",
  RUBBER = "RUBBER",
  FOAM = "FOAM",
  ALUMINUM = "ALUMINUM",
  PLASTIC = "PLASTIC",
}
registerEnumType(EquipmentMaterial, {
  name: 'EquipmentMaterial',
});

export enum EquipmentWeightCapacity {
  KG_50 = "KG_50",
  KG_100 = "KG_100",
  KG_150 = "KG_150",
  KG_200 = "KG_200",
  KG_250 = "KG_250",
  KG_300 = "KG_300",
  KG_500 = "KG_500",
}
registerEnumType(EquipmentWeightCapacity, {
  name: 'EquipmentWeightCapacity',
});

export enum EquipmentLocation {
  INDOOR = "INDOOR",
  OUTDOOR = "OUTDOOR",
  BOTH = "BOTH",
}
registerEnumType(EquipmentLocation, {
  name: 'EquipmentLocation',
});