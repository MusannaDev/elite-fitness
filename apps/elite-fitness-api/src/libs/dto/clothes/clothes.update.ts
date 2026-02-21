import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import {
  ClothesCategory,
  ClothesColor,
  ClothesGender,
  ClothesMaterial,
  ClothesSize,
  ClothesStatus,
} from "../../enums/clothes.enum";
import type { ObjectId } from "mongoose";

@InputType()
export class ClothesUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @Field(() => ClothesCategory, { nullable: true })
  clothesCategory?: ClothesCategory;

  @IsOptional()
  @Field(() => ClothesStatus, { nullable: true })
  clothesStatus?: ClothesStatus;

  @IsOptional()
  @Length(3, 100)
  @Field(() => String, { nullable: true })
  clothesName?: string;

  @IsOptional()
  @Length(2, 100)
  @Field(() => String, { nullable: true })
  clothesBrand?: string;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  clothesPrice?: number;

  @IsOptional()
  @Field(() => ClothesMaterial, { nullable: true })
  clothesMaterial?: ClothesMaterial;

  @IsOptional()
  @Field(() => ClothesSize, { nullable: true })
  clothesSize?: ClothesSize;

  @IsOptional()
  @Field(() => ClothesGender, { nullable: true })
  clothesGender?: ClothesGender;

  @IsOptional()
  @Field(() => ClothesColor, { nullable: true })
  clothesColor?: ClothesColor;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  clothesLeftCount?: number;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  clothesImages?: string[];

  @IsOptional()
  @Length(5, 500)
  @Field(() => String, { nullable: true })
  clothesDesc?: string;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isBestseller?: boolean;

  soldAt?: Date;
  
  deletedAt?: Date;
}