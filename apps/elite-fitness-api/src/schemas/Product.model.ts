import mongoose, { Schema } from "mongoose";
import { 
  ProductCategory, 
  ProductFlavor, 
  ProductStatus, 
  ProductWeight 
} from "../libs/enums/product.enum";

const ProductSchema = new Schema(
  {
    productCategory: {
      type: String,
      enum: ProductCategory,
      required: true,
    },
    productStatus: {
      type: String,
      enum: ProductStatus,
      default: ProductStatus.ACTIVE,
    },
    productName: {
      type: String,
      required: true,
    },
    productBrand: {
      type: String,
      required: true,
    },
    productPrice: {
      type: Number,
      required: true,
    },
    productWeight: {
      type: String,
      enum: ProductWeight,
      required: true,
    },
    productLeftCount: {
      type: Number,
      required: true,
    },
    productServings: {
      type: Number,
      required: true,
    },
    productFlavor: {
      type: String,
      enum: ProductFlavor,
      required: true,
    },
    productCalories: {
      type: Number,
      required: true,
    },
    productProteinPerServing: {
      type: Number,
      required: true,
    },
    productDesc: {
      type: String,
    },
    productImages: {
      type: [String],
      required: true,
    },
    isBestseller: {
      type: Boolean,
      default: false,
    },
    productViews: {
      type: Number,
      default: 0,
    },
    productLikes: {
      type: Number,
      default: 0,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Member",
    },
    soldAt: {
			type: Date,
		},
    updatedAt: {
			type: Date,
		},
		deletedAt: {
			type: Date,
		},
  },
  { timestamps: true }
);



export const ProductModel = mongoose.model("Product", ProductSchema);
