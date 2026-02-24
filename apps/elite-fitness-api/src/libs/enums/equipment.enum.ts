import { registerEnumType } from '@nestjs/graphql';

export enum EquipmentCategory {
  FREE_WEIGHTS = "FREE_WEIGHTS",
  MACHINES = "MACHINES",
  ACCESSORIES = "ACCESSORIES",
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
  KG_50 = "50KG",
  KG_100 = "100KG",
  KG_150 = "150KG",
  KG_200 = "200KG",
  KG_250 = "250KG",
  KG_300 = "300KG",
  KG_500 = "500KG",
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