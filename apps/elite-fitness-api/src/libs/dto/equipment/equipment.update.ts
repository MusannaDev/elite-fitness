import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import {
  EquipmentCategory,
  EquipmentLocation,
  EquipmentMaterial,
  EquipmentStatus,
  EquipmentWeightCapacity,
} from "../../enums/equipment.enum";
import type { ObjectId } from "mongoose";

@InputType()
export class EquipmentUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @Field(() => EquipmentCategory, { nullable: true })
  equipmentCategory?: EquipmentCategory;

  @IsOptional()
  @Field(() => EquipmentStatus, { nullable: true })
  equipmentStatus?: EquipmentStatus;

  @IsOptional()
  @Length(3, 100)
  @Field(() => String, { nullable: true })
  equipmentName?: string;

  @IsOptional()
  @Length(2, 100)
  @Field(() => String, { nullable: true })
  equipmentBrand?: string;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  equipmentPrice?: number;

  @IsOptional()
  @Field(() => EquipmentMaterial, { nullable: true })
  equipmentMaterial?: EquipmentMaterial;

  @IsOptional()
  @Field(() => EquipmentWeightCapacity, { nullable: true })
  equipmentWeightCapacity?: EquipmentWeightCapacity;

  @IsOptional()
  @Field(() => EquipmentLocation, { nullable: true })
  equipmentLocation?: EquipmentLocation;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  equipmentWeight?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  equipmentLeftCount?: number;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  equipmentImages?: string[];

  @IsOptional()
  @Length(5, 500)
  @Field(() => String, { nullable: true })
  equipmentDesc?: string;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isBestseller?: boolean;

  soldAt?: Date;
  deletedAt?: Date;
}