import { Field, Int, ObjectType } from "@nestjs/graphql";
import type { ObjectId } from "mongoose";
import {
  ClotheCategory,     // ← enum nomlarini o'zgartirmayapman, agar kerak bo'lsa alohida ayting
  ClotheColor,
  ClotheGender,
  ClotheMaterial,
  ClotheSize,
  ClotheStatus,
} from "../../enums/clothes.enum";
import { Member, TotalCounter } from "../member/member";
import { MeLiked } from "../like/like";

@ObjectType()
export class Clothe {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => ClotheCategory)
  clotheCategory: ClotheCategory;

  @Field(() => ClotheStatus)
  clotheStatus: ClotheStatus;

  @Field(() => String)
  clotheName: string;

  @Field(() => String)
  clotheBrand: string;

  @Field(() => Number)
  clothePrice: number;

  @Field(() => ClotheMaterial)
  clotheMaterial: ClotheMaterial;

  @Field(() => ClotheSize)
  clotheSize: ClotheSize;

  @Field(() => ClotheGender)
  clotheGender: ClotheGender;

  @Field(() => ClotheColor)
  clotheColor: ClotheColor;

  @Field(() => Int)
  clotheLeftCount: number;

  @Field(() => [String])
  clotheImages: string[];

  @Field(() => String, { nullable: true })
  clotheDesc?: string;

  @Field(() => Boolean)
  isBestseller: boolean;

  @Field(() => Int)
  clotheViews: number;

  @Field(() => Int)
  clotheLikes: number;

  @Field(() => Int)
  clotheComments: number;

  @Field(() => Int)
  clotheRank: number;

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
export class Clothes {
  @Field(() => [Clothe])
  list: Clothe[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}