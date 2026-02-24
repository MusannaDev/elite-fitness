import { Field, InputType, Int } from "@nestjs/graphql";
import { IsInt, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import {
  ClotheCategory,
  ClotheColor,
  ClotheGender,
  ClotheMaterial,
  ClotheSize,
  ClotheStatus,
} from "../../enums/clothes.enum";
import type { ObjectId } from "mongoose";

@InputType()
export class ClotheUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @Field(() => ClotheCategory, { nullable: true })
  clotheCategory?: ClotheCategory;

  @IsOptional()
  @Field(() => ClotheStatus, { nullable: true })
  clotheStatus?: ClotheStatus;

  @IsOptional()
  @Length(3, 100)
  @Field(() => String, { nullable: true })
  clotheName?: string;

  @IsOptional()
  @Length(2, 100)
  @Field(() => String, { nullable: true })
  clotheBrand?: string;

  @IsOptional()
  @Field(() => Number, { nullable: true })
  clothePrice?: number;

  @IsOptional()
  @Field(() => ClotheMaterial, { nullable: true })
  clotheMaterial?: ClotheMaterial;

  @IsOptional()
  @Field(() => ClotheSize, { nullable: true })
  clotheSize?: ClotheSize;

  @IsOptional()
  @Field(() => ClotheGender, { nullable: true })
  clotheGender?: ClotheGender;

  @IsOptional()
  @Field(() => ClotheColor, { nullable: true })
  clotheColor?: ClotheColor;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  clotheLeftCount?: number;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  clotheImages?: string[];

  @IsOptional()
  @Length(5, 500)
  @Field(() => String, { nullable: true })
  clotheDesc?: string;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isBestseller?: boolean;

  soldAt?: Date;  
  
  deletedAt?: Date;
}