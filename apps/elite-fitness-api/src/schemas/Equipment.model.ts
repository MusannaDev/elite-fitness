import mongoose, { Schema } from "mongoose";
import {
  EquipmentCategory,
  EquipmentLocation,
  EquipmentMaterial,
  EquipmentStatus,
  EquipmentWeightCapacity,
} from "../libs/enums/equipment.enum";

const EquipmentSchema = new Schema(
  {
    equipmentCategory: {
      type: String,
      enum: EquipmentCategory,
      required: true,
    },

    equipmentStatus: {
      type: String,
      enum: EquipmentStatus,
      default: EquipmentStatus.ACTIVE,
    },

    equipmentName: {
      type: String,
      required: true,
    },

    equipmentBrand: {
      type: String,
      required: true,
    },

    equipmentPrice: {
      type: Number,
      required: true,
    },

    equipmentMaterial: {
      type: String,
      enum: EquipmentMaterial,
      required: true,
    },

    equipmentWeightCapacity: {
      type: String,
      enum: EquipmentWeightCapacity,
    },

    equipmentLocation: {
      type: String,
      enum: EquipmentLocation,
      required: true,
    },

    // Mahsulotning o'z og'irligi (kg) — gantel uchun muhim
    equipmentWeight: {
      type: Number,
    },

    equipmentLeftCount: {
      type: Number,
      required: true,
    },

    equipmentImages: {
      type: [String],
      required: true,
    },

    equipmentDesc: {
      type: String,
    },

    isBestseller: {
      type: Boolean,
      default: false,
    },

    equipmentViews: {
      type: Number,
      default: 0,
    },

    equipmentLikes: {
      type: Number,
      default: 0,
    },

    equipmentComments: {
      type: Number,
      default: 0,
    },

    equipmentRank: {
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

EquipmentSchema.index(
  { equipmentName: 1, equipmentBrand: 1, equipmentMaterial: 1 },
  { unique: true }
);

export const EquipmentModel = mongoose.model("Equipment", EquipmentSchema);