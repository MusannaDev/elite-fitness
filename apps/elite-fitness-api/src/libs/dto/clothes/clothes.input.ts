import { Field, InputType, Int } from "@nestjs/graphql";
import { IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import {
  ClothesCategory,
  ClothesColor,
  ClothesGender,
  ClothesMaterial,
  ClothesSize,
  ClothesStatus,
} from "../../enums/clothes.enum";
import { Direction } from "../../enums/common.enum";
import { availableClothesSorts } from "../../config";
import type { ObjectId } from "mongoose";

// ============================================================
//                        CREATE
// ============================================================

@InputType()
export class ClothesInput {
  @IsNotEmpty()
  @Field(() => ClothesCategory)
  clothesCategory: ClothesCategory;

  @IsNotEmpty()
  @Length(3, 100)
  @Field(() => String)
  clothesName: string;

  @IsNotEmpty()
  @Length(2, 100)
  @Field(() => String)
  clothesBrand: string;

  @IsNotEmpty()
  @Field(() => Number)
  clothesPrice: number;

  @IsNotEmpty()
  @Field(() => ClothesMaterial)
  clothesMaterial: ClothesMaterial;

  @IsNotEmpty()
  @Field(() => ClothesSize)
  clothesSize: ClothesSize;

  @IsNotEmpty()
  @Field(() => ClothesGender)
  clothesGender: ClothesGender;

  @IsNotEmpty()
  @Field(() => ClothesColor)
  clothesColor: ClothesColor;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Field(() => Int)
  clothesLeftCount: number;

  @IsNotEmpty()
  @Field(() => [String])
  clothesImages: string[];

  @IsOptional()
  @Length(5, 500)
  @Field(() => String, { nullable: true })
  clothesDesc?: string;

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
class CISearch {
  @IsOptional()
  @Field(() => String, { nullable: true })
  memberId?: ObjectId;

  @IsOptional()
  @Field(() => [ClothesCategory], { nullable: true })
  categoryList?: ClothesCategory[];

  @IsOptional()
  @Field(() => [ClothesMaterial], { nullable: true })
  materialList?: ClothesMaterial[];

  @IsOptional()
  @Field(() => [ClothesSize], { nullable: true })
  sizeList?: ClothesSize[];

  @IsOptional()
  @Field(() => [ClothesGender], { nullable: true })
  genderList?: ClothesGender[];

  @IsOptional()
  @Field(() => [ClothesColor], { nullable: true })
  colorList?: ClothesColor[];

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
export class ClothesInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableClothesSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => CISearch)
  search: CISearch;
}

// ============================================================
//                     INQUIRY - AGENT
// ============================================================

@InputType()
class ACISearch {
  @IsOptional()
  @Field(() => ClothesStatus, { nullable: true })
  clothesStatus?: ClothesStatus;
}

@InputType()
export class AgentClothesInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableClothesSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => ACISearch)
  search: ACISearch;
}

// ============================================================
//                     INQUIRY - ADMIN
// ============================================================

@InputType()
class ALCISearch {
  @IsOptional()
  @Field(() => ClothesStatus, { nullable: true })
  clothesStatus?: ClothesStatus;

  @IsOptional()
  @Field(() => [ClothesCategory], { nullable: true })
  categoryList?: ClothesCategory[];
}

@InputType()
export class AllClothesInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableClothesSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => ALCISearch)
  search: ALCISearch;
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