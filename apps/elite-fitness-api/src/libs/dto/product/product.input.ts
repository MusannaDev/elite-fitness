import { Field, InputType, Int } from "@nestjs/graphql";
import { 
  IsNotEmpty, 
  IsNumber, 
  IsOptional, 
  IsBoolean, 
  Length, 
  Min 
} from "class-validator";
import { 
  ProductCategory, 
  ProductFlavor, 
  ProductWeight 
} from "../../enums/product.enum";

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
  @Field(() => Int)
  productLeftCount: number;

  @IsNotEmpty()
  @Field(() => Int)
  productServings: number;

  @IsNotEmpty()
  @Field(() => ProductFlavor)
  productFlavor: ProductFlavor;

  @IsNotEmpty()
  @Field(() => Int)
  productCalories: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Number)
  productProteinPerServing: number;

  @IsOptional()
  @Field(() => String, { nullable: true })
  productDesc?: string;

  @IsNotEmpty()
  @Field(() => [String])
  productImages: string[];

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  isBestseller?: boolean;
}