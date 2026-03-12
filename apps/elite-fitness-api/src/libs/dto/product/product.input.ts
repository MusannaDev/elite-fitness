import { Field, Float, InputType, Int } from "@nestjs/graphql";
import {
  IsBoolean,
  IsIn,
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
import { Direction } from "../../enums/common.enum";
import { availableProductSorts } from "../../config";
import type { ObjectId } from "mongoose";

// ============================================================
//                        CREATE
// ============================================================

@InputType()
export class ProductInput {
  @IsNotEmpty()
  @Field(() => ProductCategory)
  productCategory: ProductCategory;

  @IsNotEmpty()
  @Length(2, 100)
  @Field(() => String)
  productName: string;

  @IsNotEmpty()
  @Field(() => String)
  productBrand: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Field(() => Number)
  productPrice: number;

  @IsNotEmpty()
  @Field(() => ProductWeight)
  productWeight: ProductWeight;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Field(() => Int)
  productLeftCount: number;

  @IsNotEmpty()
  @Field(() => ProductBenefits)
  productBenefits: ProductBenefits;

  @IsNotEmpty()
  @Field(() => ProductFlavor)
  productFlavor: ProductFlavor;

  @IsNotEmpty()
  @IsInt()
  @Field(() => Int)
  productCalories: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Float, { nullable: true })
  productProteinPerServing?: number;

  @IsNotEmpty()
  @Field(() => [String])
  productImages: string[];

  @IsOptional()
  @Length(5, 500)
  @Field(() => String, { nullable: true })
  productDesc?: string;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  isBestseller?: boolean;

  memberId?: ObjectId;
}

// ============================================================
//                     INQUIRY - USER
// ============================================================

@InputType()
export class ProductPricesRange {
  @Field(() => Int)
  start: number;

  @Field(() => Int)
  end: number;
}

@InputType()
export class ProductPeriodsRange {
  @Field(() => Date)
  start: Date;

  @Field(() => Date)
  end: Date;
}

@InputType()
class PRISearch {
  @IsOptional()
  @Field(() => String, { nullable: true })
  memberId?: ObjectId;

  @IsOptional()
  @Field(() => [ProductCategory], { nullable: true })
  categoryList?: ProductCategory[];

  @IsOptional()
  @Field(() => [ProductWeight], { nullable: true })
  weightList?: ProductWeight[];

  @IsOptional()
  @Field(() => [ProductFlavor], { nullable: true })
  flavorList?: ProductFlavor[];

  @IsOptional()
  @Field(() => [ProductBenefits], { nullable: true })
  benefitsList?: ProductBenefits[];

  @IsOptional()
  @Field(() => ProductPricesRange, { nullable: true })
  pricesRange?: ProductPricesRange;

  @IsOptional()
  @Field(() => ProductPeriodsRange, { nullable: true })
  periodsRange?: ProductPeriodsRange;

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string;
}

@InputType()
export class ProductsInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableProductSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => PRISearch)
  search: PRISearch;
}

// ============================================================
//                     INQUIRY - TRAINER
// ============================================================

@InputType()
class TPISearch {
  @IsOptional()
  @Field(() => ProductStatus, { nullable: true })
  productStatus?: ProductStatus;
}

@InputType()
export class TrainerProductsInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableProductSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => TPISearch)
  search: TPISearch;
}

// ============================================================
//                     INQUIRY - ADMIN
// ============================================================

@InputType()
class ALLPRISearch {
  @IsOptional()
  @Field(() => ProductStatus, { nullable: true })
  productStatus?: ProductStatus;

  @IsOptional()
  @Field(() => [ProductCategory], { nullable: true })
  categoryList?: ProductCategory[];
}

@InputType()
export class AllProductsInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableProductSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => ALLPRISearch)
  search: ALLPRISearch;
}

// ============================================================
//                     ORDINARY INQUIRY
// ============================================================

@InputType()
export class ProductOrdinaryInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;
}