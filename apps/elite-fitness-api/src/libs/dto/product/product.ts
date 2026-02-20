import { Field, Int, ObjectType } from "@nestjs/graphql";
import type { ObjectId } from "mongoose";
import { 
  ProductCategory, 
  ProductFlavor, 
  ProductStatus, 
  ProductWeight 
} from "../../enums/product.enum";

@ObjectType()
export class Product {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => ProductCategory)
  productCategory: ProductCategory;

  @Field(() => ProductStatus)
  productStatus: ProductStatus;

  @Field(() => String)
  productName: string;

  @Field(() => String)
  productBrand: string;

  @Field(() => Number)
  productPrice: number;

  @Field(() => ProductWeight)
  productWeight: ProductWeight;

  @Field(() => Int)
  productLeftCount: number;

  @Field(() => Int)
  productServings: number;

  @Field(() => ProductFlavor)
  productFlavor: ProductFlavor;

  @Field(() => Int)
  productCalories: number;

  @Field(() => Number)
  productProteinPerServing: number;

  @Field(() => String, { nullable: true })
  productDesc?: string;

  @Field(() => [String])
  productImages: string[];

  @Field(() => Boolean, { defaultValue: false })
  isBestseller: boolean;

  @Field(() => Int, { defaultValue: 0 })
  productViews: number;

  @Field(() => Int, { defaultValue: 0 })
  productLikes: number;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}