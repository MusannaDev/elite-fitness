import { Field, InputType, Int } from "@nestjs/graphql";
import { IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import {
  EquipmentCategory,
  EquipmentLocation,
  EquipmentMaterial,
  EquipmentStatus,
  EquipmentWeightCapacity,
} from "../../enums/equipment.enum";
import { Direction } from "../../enums/common.enum";
import { availableEquipmentSorts } from "../../config";
import type { ObjectId } from "mongoose";

// ============================================================
//                        CREATE
// ============================================================

@InputType()
export class EquipmentInput {
  @IsNotEmpty()
  @Field(() => EquipmentCategory)
  equipmentCategory: EquipmentCategory;

  @IsNotEmpty()
  @Length(3, 100)
  @Field(() => String)
  equipmentName: string;

  @IsNotEmpty()
  @Length(2, 100)
  @Field(() => String)
  equipmentBrand: string;

  @IsNotEmpty()
  @Field(() => Number)
  equipmentPrice: number;

  @IsNotEmpty()
  @Field(() => EquipmentMaterial)
  equipmentMaterial: EquipmentMaterial;

  @IsNotEmpty()
  @Field(() => EquipmentLocation)
  equipmentLocation: EquipmentLocation;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Field(() => Int)
  equipmentLeftCount: number;

  @IsNotEmpty()
  @Field(() => [String])
  equipmentImages: string[];

  @IsOptional()
  @Field(() => EquipmentWeightCapacity, { nullable: true })
  equipmentWeightCapacity?: EquipmentWeightCapacity;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  equipmentWeight?: number;

  @IsOptional()
  @Length(5, 500)
  @Field(() => String, { nullable: true })
  equipmentDesc?: string;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isBestseller?: boolean;

  memberId?: ObjectId;
}

// ============================================================
//                     INQUIRY - USER
// ============================================================

@InputType()
export class PricesRange {
  @Field(() => Int)
  start: number;

  @Field(() => Int)
  end: number;
}

@InputType()
export class PeriodsRange {
  @Field(() => Date)
  start: Date;

  @Field(() => Date)
  end: Date;
}

@InputType()
class EISearch {
  @IsOptional()
  @Field(() => String, { nullable: true })
  memberId?: ObjectId;

  @IsOptional()
  @Field(() => [EquipmentCategory], { nullable: true })
  categoryList?: EquipmentCategory[];

  @IsOptional()
  @Field(() => [EquipmentMaterial], { nullable: true })
  materialList?: EquipmentMaterial[];

  @IsOptional()
  @Field(() => [EquipmentLocation], { nullable: true })
  locationList?: EquipmentLocation[];

  @IsOptional()
  @Field(() => [EquipmentWeightCapacity], { nullable: true })
  weightCapacityList?: EquipmentWeightCapacity[];

  @IsOptional()
  @Field(() => PricesRange, { nullable: true })
  pricesRange?: PricesRange;

  @IsOptional()
  @Field(() => PeriodsRange, { nullable: true })
  periodsRange?: PeriodsRange;

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string;
}

@InputType()
export class EquipmentsInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableEquipmentSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => EISearch)
  search: EISearch;
}

// ============================================================
//                     INQUIRY - AGENT
// ============================================================

@InputType()
class AEISearch {
  @IsOptional()
  @Field(() => EquipmentStatus, { nullable: true })
  equipmentStatus?: EquipmentStatus;
}

@InputType()
export class AgentEquipmentsInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableEquipmentSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => AEISearch)
  search: AEISearch;
}

// ============================================================
//                     INQUIRY - ADMIN
// ============================================================

@InputType()
class ALEISearch {
  @IsOptional()
  @Field(() => EquipmentStatus, { nullable: true })
  equipmentStatus?: EquipmentStatus;

  @IsOptional()
  @Field(() => [EquipmentCategory], { nullable: true })
  categoryList?: EquipmentCategory[];
}

@InputType()
export class AllEquipmentsInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableEquipmentSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => ALEISearch)
  search: ALEISearch;
}

// ============================================================
//                     ORDINARY INQUIRY
// ============================================================

@InputType()
export class OrdinaryInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;
}