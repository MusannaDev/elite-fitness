import mongoose, { Schema } from "mongoose";
import {
  ClotheCategory,
  ClotheColor,
  ClotheGender,
  ClotheMaterial,
  ClotheSize,
  ClotheStatus,
} from "../libs/enums/clothes.enum";

const ClothesSchema = new Schema(
  {
    clotheCategory: {
      type: String,
      enum: ClotheCategory,
      required: true,
    },

    clotheStatus: {
      type: String,
      enum: ClotheStatus,
      default: ClotheStatus.ACTIVE,
    },

    clotheName: {
      type: String,
      required: true,
    },

    clotheBrand: {
      type: String,
      required: true,
    },

    clothePrice: {
      type: Number,
      required: true,
    },

    clotheMaterial: {
      type: String,
      enum: ClotheMaterial,
      required: true,
    },

    clotheSize: {
      type: String,
      enum: ClotheSize,
      required: true,
    },

    clotheGender: {
      type: String,
      enum: ClotheGender,
      required: true,
    },

    clotheColor: {
      type: String,
      enum: ClotheColor,
      required: true,
    },

    clotheLeftCount: {
      type: Number,
      required: true,
    },

    clotheImages: {
      type: [String],
      required: true,
    },

    clotheDesc: {
      type: String,
    },

    isBestseller: {
      type: Boolean,
      default: false,
    },

    clotheViews: {
      type: Number,
      default: 0,
    },

    clotheLikes: {
      type: Number,
      default: 0,
    },

    clotheComments: {
      type: Number,
      default: 0,
    },

    clotheRank: {
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
  { clotheName: 1, clotheBrand: 1, clotheSize: 1, clotheColor: 1 },
  { unique: true }
);

export default ClothesSchema;