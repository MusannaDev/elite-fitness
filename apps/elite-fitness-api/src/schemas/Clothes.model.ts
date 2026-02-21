import mongoose, { Schema } from "mongoose";
import {
  ClothesCategory,
  ClothesColor,
  ClothesGender,
  ClothesMaterial,
  ClothesSize,
  ClothesStatus,
} from "../libs/enums/clothes.enum";

const ClothesSchema = new Schema(
  {
    clothesCategory: {
      type: String,
      enum: ClothesCategory,
      required: true,
    },

    clothesStatus: {
      type: String,
      enum: ClothesStatus,
      default: ClothesStatus.ACTIVE,
    },

    clothesName: {
      type: String,
      required: true,
    },

    clothesBrand: {
      type: String,
      required: true,
    },

    clothesPrice: {
      type: Number,
      required: true,
    },

    clothesMaterial: {
      type: String,
      enum: ClothesMaterial,
      required: true,
    },

    clothesSize: {
      type: String,
      enum: ClothesSize,
      required: true,
    },

    clothesGender: {
      type: String,
      enum: ClothesGender,
      required: true,
    },

    clothesColor: {
      type: String,
      enum: ClothesColor,
      required: true,
    },

    clothesLeftCount: {
      type: Number,
      required: true,
    },

    clothesImages: {
      type: [String],
      required: true,
    },

    clothesDesc: {
      type: String,
    },

    isBestseller: {
      type: Boolean,
      default: false,
    },

    clothesViews: {
      type: Number,
      default: 0,
    },

    clothesLikes: {
      type: Number,
      default: 0,
    },

    clothesComments: {
      type: Number,
      default: 0,
    },

    clothesRank: {
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

    deletedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

ClothesSchema.index(
  { clothesName: 1, clothesBrand: 1, clothesSize: 1, clothesColor: 1 },
  { unique: true }
);

export const ClothesModel = mongoose.model("Clothes", ClothesSchema);