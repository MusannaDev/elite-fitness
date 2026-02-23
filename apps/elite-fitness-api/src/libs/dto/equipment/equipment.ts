import { Field, Int, ObjectType } from "@nestjs/graphql";
import type { ObjectId } from "mongoose";
import {
  EquipmentCategory,
  EquipmentLocation,
  EquipmentMaterial,
  EquipmentStatus,
  EquipmentWeightCapacity,
} from "../../enums/equipment.enum";
import { Member, TotalCounter } from "../member/member";
import { MeLiked } from "../like/like";

@ObjectType()
export class Equipment {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => EquipmentCategory)
  equipmentCategory: EquipmentCategory;

  @Field(() => EquipmentStatus)
  equipmentStatus: EquipmentStatus;

  @Field(() => String)
  equipmentName: string;

  @Field(() => String)
  equipmentBrand: string;

  @Field(() => Number)
  equipmentPrice: number;

  @Field(() => EquipmentMaterial)
  equipmentMaterial: EquipmentMaterial;

  @Field(() => EquipmentWeightCapacity, { nullable: true })
  equipmentWeightCapacity?: EquipmentWeightCapacity;

  @Field(() => EquipmentLocation)
  equipmentLocation: EquipmentLocation;

  @Field(() => Number, { nullable: true })
  equipmentWeight?: number;

  @Field(() => Int)
  equipmentLeftCount: number;

  @Field(() => [String])
  equipmentImages: string[];

  @Field(() => String, { nullable: true })
  equipmentDesc?: string;

  @Field(() => Boolean)
  isBestseller: boolean;

  @Field(() => Int)
  equipmentViews: number;

  @Field(() => Int)
  equipmentLikes: number;

  @Field(() => Int)
  equipmentComments: number;

  @Field(() => Int)
  equipmentRank: number;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Date, { nullable: true })
  soldAt?: Date;

  @Field(() => Date, { nullable: true })
  deletedAt?: Date;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  /* from Aggregation */
  @Field(() => Member, { nullable: true })
  memberData?: Member;

  @Field(() => [MeLiked], { nullable: true })
  meLiked?: MeLiked[];
}

@ObjectType()
export class Equipments {
  @Field(() => [Equipment])
  list: Equipment[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}