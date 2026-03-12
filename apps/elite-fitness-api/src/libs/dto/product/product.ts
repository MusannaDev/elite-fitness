import { Field, Float, Int, ObjectType } from "@nestjs/graphql";
import type { ObjectId } from "mongoose";
import {
  ProductBenefits,
  ProductCategory,
  ProductFlavor,
  ProductStatus,
  ProductWeight,
} from "../../enums/product.enum";
import { Member, TotalCounter } from "../member/member";
import { MeLiked } from "../like/like";

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

  @Field(() => ProductBenefits)
  productBenefits: ProductBenefits;

  @Field(() => ProductFlavor)
  productFlavor: ProductFlavor;

  @Field(() => Int)
  productCalories: number;

  @Field(() => Float, { nullable: true })
  productProteinPerServing?: number;

  @Field(() => String, { nullable: true })
  productDesc?: string;

  @Field(() => [String])
  productImages: string[];

  @Field(() => Boolean)
  isBestseller: boolean;

  @Field(() => Int)
  productViews: number;

  @Field(() => Int)
  productLikes: number;

  @Field(() => Int)
  productComments: number;

  @Field(() => Int)
  productRank: number;

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
export class Products {
  @Field(() => [Product])
  list: Product[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}