import { Field, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { InquiryStatus, InquiryType } from '../../enums/inquiry.enum';
import { TotalCounter } from '../member/member';
import { Member } from '../member/member';

@ObjectType()
export class Inquiry {
	@Field(() => String)
	_id: ObjectId;

	@Field(() => InquiryType)
	inquiryType: InquiryType;

	@Field(() => InquiryStatus)
	inquiryStatus: InquiryStatus;

	@Field(() => String)
	inquiryTitle: string;

	@Field(() => String)
	inquiryContent: string;

	@Field(() => [String])
	inquiryImages: string[];

	@Field(() => String)
	memberId: ObjectId;

	@Field(() => String, { nullable: true })
	adminResponse?: string;

	@Field(() => Date, { nullable: true })
	respondedAt?: Date;

	@Field(() => Date)
	createdAt: Date;

	@Field(() => Date)
	updatedAt: Date;

	/* from Aggregation */
	@Field(() => Member, { nullable: true })
	memberData?: Member;
}

@ObjectType()
export class Inquiries {
	@Field(() => [Inquiry])
	list: Inquiry[];

	@Field(() => [TotalCounter], { nullable: true })
	metaCounter: TotalCounter[];
}
