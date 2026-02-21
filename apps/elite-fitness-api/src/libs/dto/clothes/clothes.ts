import { Field, Int, ObjectType } from "@nestjs/graphql";
import type { ObjectId } from "mongoose";
import {
  ClothesCategory,
  ClothesColor,
  ClothesGender,
  ClothesMaterial,
  ClothesSize,
  ClothesStatus,
} from "../../enums/clothes.enum";
import { Member, TotalCounter } from "../member/member";
import { MeLiked } from "../like/like";

@ObjectType()
export class Clothes {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => ClothesCategory)
  clothesCategory: ClothesCategory;

  @Field(() => ClothesStatus)
  clothesStatus: ClothesStatus;

  @Field(() => String)
  clothesName: string;

  @Field(() => String)
  clothesBrand: string;

  @Field(() => Number)
  clothesPrice: number;

  @Field(() => ClothesMaterial)
  clothesMaterial: ClothesMaterial;

  @Field(() => ClothesSize)
  clothesSize: ClothesSize;

  @Field(() => ClothesGender)
  clothesGender: ClothesGender;

  @Field(() => ClothesColor)
  clothesColor: ClothesColor;

  @Field(() => Int)
  clothesLeftCount: number;

  @Field(() => [String])
  clothesImages: string[];

  @Field(() => String, { nullable: true })
  clothesDesc?: string;

  @Field(() => Boolean)
  isBestseller: boolean;

  @Field(() => Int)
  clothesViews: number;

  @Field(() => Int)
  clothesLikes: number;

  @Field(() => Int)
  clothesComments: number;

  @Field(() => Int)
  clothesRank: number;

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
export class ClothesList {
  @Field(() => [Clothes])
  list: Clothes[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}