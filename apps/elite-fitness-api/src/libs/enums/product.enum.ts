import { registerEnumType } from '@nestjs/graphql';

export enum ProductCategory {
  PROTEIN = "PROTEIN",
  CREATINE = "CREATINE",
  VITAMINS = "VITAMINS",
  AMINO_ACIDS = "AMINO_ACIDS",
  PRE_WORKOUT = "PRE_WORKOUT",
  WEIGHT_GAINER = "WEIGHT_GAINER",
  FAT_BURNER = "FAT_BURNER",
  OMEGA = "OMEGA",
  OTHERS = "OTHERS"
}
registerEnumType(ProductCategory, {
  name: 'ProductCategory',
});

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  SOLD = "SOLD",
  DELETE = "DELETE",
}
registerEnumType(ProductStatus, {
  name: 'ProductStatus',
});

export enum ProductFlavor {
  CHOCOLATE = "CHOCOLATE",
  VANILLA = "VANILLA",
  STRAWBERRY = "STRAWBERRY",
  UNFLAVORED = "UNFLAVORED",
  BANANA = "BANANA",
  OTHER = "OTHER"
}
registerEnumType(ProductFlavor, {
  name: 'ProductFlavor',
});

export enum ProductWeight {
  QUARTER_KG = "QUARTER_KG",
  HALF_KG = "HALF_KG",
  ONE_KG = "ONE_KG",
  TWO_KG = "TWO_KG",
  TWO_HALF_KG = "TWO_HALF_KG",
  THREE_KG = "THREE_KG",
  FIVE_KG = "FIVE_KG",
}
registerEnumType(ProductWeight, {
  name: 'ProductWeight',
});

export enum ProductBenefits {
  MUSCLE_GROWTH = "MUSCLE_GROWTH",
  WEIGHT_LOSS = "WEIGHT_LOSS",
  ENERGY_BOOST = "ENERGY_BOOST",
  RECOVERY = "RECOVERY",
  ENDURANCE = "ENDURANCE",
  IMMUNE_SUPPORT = "IMMUNE_SUPPORT",
  JOINT_HEALTH = "JOINT_HEALTH",
  FAT_BURNING = "FAT_BURNING",
  HYDRATION = "HYDRATION",
}
registerEnumType(ProductBenefits, {
  name: 'ProductBenefits',
});