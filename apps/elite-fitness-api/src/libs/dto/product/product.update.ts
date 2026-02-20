import { Field, InputType, Int } from "@nestjs/graphql";
import { IsOptional, IsNumber, IsBoolean, Length } from "class-validator";
import type { ObjectId } from "mongoose";
import { 
  ProductCategory, 
  ProductFlavor, 
  ProductStatus, 
  ProductWeight 
} from "../../enums/product.enum";

@InputType()
export class ProductUpdate {
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
  @Field(() => Number, { nullable: true })
  productPrice?: number;

  @IsOptional()
  @Field(() => ProductWeight, { nullable: true })
  productWeight?: ProductWeight;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  productLeftCount?: number;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  productServings?: number;

  @IsOptional()
  @Field(() => ProductFlavor, { nullable: true })
  productFlavor?: ProductFlavor;

  @IsOptional()
  @Field(() => Int, { nullable: true })
  productCalories?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Number, { nullable: true })
  productProteinPerServing?: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  productDesc?: string;

  @IsOptional()
  @Field(() => [String], { nullable: true })
  productImages?: string[];

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  isBestseller?: boolean;
}