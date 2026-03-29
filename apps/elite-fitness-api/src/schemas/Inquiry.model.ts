import mongoose, { Schema } from 'mongoose';
import { InquiryStatus, InquiryType } from '../libs/enums/inquiry.enum';

const InquirySchema = new Schema(
	{
		inquiryType: {
			type: String,
			enum: InquiryType,
			required: true,
		},

		inquiryStatus: {
			type: String,
			enum: InquiryStatus,
			default: InquiryStatus.PENDING,
		},

		inquiryTitle: {
			type: String,
			required: true,
		},

		inquiryContent: {
			type: String,
			required: true,
		},

		inquiryImages: {
			type: [String],
			default: [],
		},

		memberId: {
			type: Schema.Types.ObjectId,
			required: true,
			ref: 'Member',
		},

		adminResponse: {
			type: String,
			default: null,
		},

		respondedAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true, collection: 'inquiries' },
);

export default InquirySchema;
