import {
	BadRequestException,
	Injectable,
	InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Inquiry, Inquiries } from '../../../libs/dto/inquiry/inquiry';
import { InquiryInput, InquiriesInquiry } from '../../../libs/dto/inquiry/inquiry.input';
import { InquiryUpdate } from '../../../libs/dto/inquiry/inquiry.update';
import { InquiryStatus } from '../../../libs/enums/inquiry.enum';
import { Direction, Message } from '../../../libs/enums/common.enum';
import { lookupMember, shapeIntoMongoObjectId } from '../../../libs/config';
import { T } from '../../../libs/types/common';

@Injectable()
export class InquiryService {
	constructor(
		@InjectModel('Inquiry') private readonly inquiryModel: Model<Inquiry>,
	) {}

	/* USER */

	public async createInquiry(memberId: ObjectId, input: InquiryInput): Promise<Inquiry> {
		try {
			input.memberId = memberId;
			return await this.inquiryModel.create(input);
		} catch (err) {
			console.log('Error, InquiryService.createInquiry:', err.message);
			throw new BadRequestException(Message.CREATE_FAILED);
		}
	}

	public async updateInquiry(memberId: ObjectId, input: InquiryUpdate): Promise<Inquiry> {
		const search: T = {
			_id: input._id,
			memberId: memberId,
			inquiryStatus: InquiryStatus.PENDING,
		};

		const result = await this.inquiryModel
			.findOneAndUpdate(search, input, { new: true })
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async deleteInquiry(memberId: ObjectId, inquiryId: ObjectId): Promise<Inquiry> {
		const search: T = {
			_id: inquiryId,
			memberId: memberId,
			inquiryStatus: InquiryStatus.PENDING,
		};

		const result = await this.inquiryModel
			.findOneAndUpdate(search, { inquiryStatus: InquiryStatus.DELETE }, { new: true })
			.exec();

		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		return result;
	}

	public async getInquiry(memberId: ObjectId, inquiryId: ObjectId): Promise<Inquiry> {
		const result = await this.inquiryModel
			.aggregate([
				{
					$match: {
						_id: shapeIntoMongoObjectId(inquiryId),
						memberId: memberId,
						inquiryStatus: { $ne: InquiryStatus.DELETE },
					},
				},
				lookupMember,
				{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	public async getInquiries(memberId: ObjectId, input: InquiriesInquiry): Promise<Inquiries> {
		const { inquiryType, inquiryStatus, text } = input.search;
		const match: T = {
			memberId: memberId,
			inquiryStatus: { $ne: InquiryStatus.DELETE },
		};
		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};

		if (inquiryType) match.inquiryType = inquiryType;
		if (inquiryStatus) match.inquiryStatus = inquiryStatus;
		if (text) match.inquiryTitle = { $regex: new RegExp(text, 'i') };

		const result = await this.inquiryModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				lookupMember,
				{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}

	/* ADMIN */

	public async updateInquiryByAdmin(input: InquiryUpdate): Promise<Inquiry> {
		const search: T = {
			_id: input._id,
			inquiryStatus: { $ne: InquiryStatus.DELETE },
		};

		if (input.adminResponse) {
			(input as T).respondedAt = new Date();
			(input as T).inquiryStatus = InquiryStatus.ANSWERED;
		}

		const result = await this.inquiryModel
			.findOneAndUpdate(search, input, { new: true })
			.exec();

		if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
		return result;
	}

	public async removeInquiryByAdmin(inquiryId: ObjectId): Promise<Inquiry> {
		const search: T = {
			_id: inquiryId,
			inquiryStatus: InquiryStatus.DELETE,
		};

		const result = await this.inquiryModel.findOneAndDelete(search).exec();
		if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
		return result;
	}

	public async getInquiriesByAdmin(input: InquiriesInquiry): Promise<Inquiries> {
		const { inquiryType, inquiryStatus, text } = input.search;
		const match: T = {};
		const sort: T = {
			[input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
		};

		if (inquiryType) match.inquiryType = inquiryType;
		if (inquiryStatus) match.inquiryStatus = inquiryStatus;
		if (text) match.inquiryTitle = { $regex: new RegExp(text, 'i') };

		const result = await this.inquiryModel
			.aggregate([
				{ $match: match },
				{ $sort: sort },
				lookupMember,
				{ $unwind: { path: '$memberData', preserveNullAndEmptyArrays: true } },
				{
					$facet: {
						list: [
							{ $skip: (input.page - 1) * input.limit },
							{ $limit: input.limit },
						],
						metaCounter: [{ $count: 'total' }],
					},
				},
			])
			.exec();

		if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
		return result[0];
	}
}
