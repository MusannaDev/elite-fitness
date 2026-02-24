import { Field, InputType, Int } from "@nestjs/graphql";
import { IsIn, IsInt, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import {
  ClotheCategory,
  ClotheColor,
  ClotheGender,
  ClotheMaterial,
  ClotheSize,
  ClotheStatus,
} from "../../enums/clothes.enum";  // ← enum fayl nomini o'zgartirishni unutmang!
import { Direction } from "../../enums/common.enum";
import { availableClothesSorts } from "../../config";  // ← bu ham o'zgartirilishi mumkin: availableClotheSorts
import type { ObjectId } from "mongoose";

// ============================================================
//                        CREATE
// ============================================================

@InputType()
export class ClotheInput {
  @IsNotEmpty()
  @Field(() => ClotheCategory)
  clotheCategory: ClotheCategory;

  @IsNotEmpty()
  @Length(3, 100)
  @Field(() => String)
  clotheName: string;

  @IsNotEmpty()
  @Length(2, 100)
  @Field(() => String)
  clotheBrand: string;

  @IsNotEmpty()
  @Field(() => Number)
  clothePrice: number;

  @IsNotEmpty()
  @Field(() => ClotheMaterial)
  clotheMaterial: ClotheMaterial;

  @IsNotEmpty()
  @Field(() => ClotheSize)
  clotheSize: ClotheSize;

  @IsNotEmpty()
  @Field(() => ClotheGender)
  clotheGender: ClotheGender;

  @IsNotEmpty()
  @Field(() => ClotheColor)
  clotheColor: ClotheColor;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Field(() => Int)
  clotheLeftCount: number;

  @IsNotEmpty()
  @Field(() => [String])
  clotheImages: string[];

  @IsOptional()
  @Length(5, 500)
  @Field(() => String, { nullable: true })
  clotheDesc?: string;

  @IsOptional()
  @Field(() => Boolean, { nullable: true })
  isBestseller?: boolean;

  memberId?: ObjectId;
}

// ============================================================
//                     INQUIRY - USER
// ============================================================

@InputType()
export class ClothesPricesRange {
  @Field(() => Int)
  start: number;

  @Field(() => Int)
  end: number;
}

@InputType()
export class ClothesPeriodsRange {
  @Field(() => Date)
  start: Date;

  @Field(() => Date)
  end: Date;
}

@InputType()
class CLOISearch {
  @IsOptional()
  @Field(() => String, { nullable: true })
  memberId?: ObjectId;

  @IsOptional()
  @Field(() => [ClotheCategory], { nullable: true })
  categoryList?: ClotheCategory[];

  @IsOptional()
  @Field(() => [ClotheMaterial], { nullable: true })
  materialList?: ClotheMaterial[];

  @IsOptional()
  @Field(() => [ClotheSize], { nullable: true })
  sizeList?: ClotheSize[];

  @IsOptional()
  @Field(() => [ClotheGender], { nullable: true })
  genderList?: ClotheGender[];

  @IsOptional()
  @Field(() => [ClotheColor], { nullable: true })
  colorList?: ClotheColor[];

  @IsOptional()
  @Field(() => ClothesPricesRange, { nullable: true })
  pricesRange?: ClothesPricesRange;

  @IsOptional()
  @Field(() => ClothesPeriodsRange, { nullable: true })
  periodsRange?: ClothesPeriodsRange;

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string;
}

@InputType()
export class ClotheInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableClothesSorts)           // ← bu massivni ham clothe ga moslashtiring
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => CLOISearch)
  search: CLOISearch;
}

// ============================================================
//                     INQUIRY - AGENT
// ============================================================

@InputType()
class SMCISearch {
  @IsOptional()
  @Field(() => ClotheStatus, { nullable: true })
  clotheStatus?: ClotheStatus;
}

@InputType()
export class SalesManagerClotheInquiry {
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
  @Field(() => SMCISearch)
  search: SMCISearch;
}

// ============================================================
//                     INQUIRY - ADMIN
// ============================================================

@InputType()
class ALCISearch {
  @IsOptional()
  @Field(() => ClotheStatus, { nullable: true })
  clotheStatus?: ClotheStatus;

  @IsOptional()
  @Field(() => [ClotheCategory], { nullable: true })
  categoryList?: ClotheCategory[];
}

@InputType()
export class AllClotheInquiry {
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
export class ClotheOrdinaryInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;
}