import { Field, Float, InputType, Int } from "@nestjs/graphql";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Length,
  Min,
} from "class-validator";
import {
  ProductBenefits,
  ProductCategory,
  ProductFlavor,
  ProductStatus,
  ProductWeight,
} from "../../enums/product.enum";
import type { ObjectId } from "mongoose";

@InputType()
export class ProductUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @Field(() => ProductCategory, { nullable: true })
  productCategory?: ProductCategory;

  @IsOptional()
  @Field(() => ProductStatus, { nullable: true })
  productStatus?: ProductStatus;

  @IsOptional()
  @Length(2, 100)
  @Field(() => String, { nullable: true })
  productName?: string;

  @IsOptional()
  @Field(() => String, { nullable: true })
  productBrand?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Field(() => Number, { nullable: true })
  productPrice?: number;

  @IsOptional()
  @Field(() => ProductWeight, { nullable: true })
  productWeight?: ProductWeight;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Field(() => Int, { nullable: true })
  productLeftCount?: number;

  @IsOptional()
  @Field(() => ProductBenefits, { nullable: true })
  productBenefits?: ProductBenefits;

  @IsOptional()
  @Field(() => ProductFlavor, { nullable: true })
  productFlavor?: ProductFlavor;

  @IsOptional()
  @IsInt()
  @Field(() => Int, { nullable: true })
  productCalories?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  productProteinPerServing?: number;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  productImages?: string[];

  @IsOptional()
  @Length(5, 500)
  @Field(() => String, { nullable: true })
  productDesc?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  isBestseller?: boolean;

  soldAt?: Date;
  
  deletedAt?: Date;
}