import { Field, InputType, Int } from '@nestjs/graphql';
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from 'class-validator';
import { InquiryStatus, InquiryType } from '../../enums/inquiry.enum';
import { Direction } from '../../enums/common.enum';
import { availableInquirySorts } from '../../config';
import type { ObjectId } from 'mongoose';

@InputType()
export class InquiryInput {
	@IsNotEmpty()
	@Field(() => InquiryType)
	inquiryType: InquiryType;

	@IsNotEmpty()
	@Length(3, 100)
	@Field(() => String)
	inquiryTitle: string;

	@IsNotEmpty()
	@Length(5, 2000)
	@Field(() => String)
	inquiryContent: string;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	inquiryImages?: string[];

	memberId?: ObjectId;
}

@InputType()
class IISearch {
	@IsOptional()
	@Field(() => InquiryType, { nullable: true })
	inquiryType?: InquiryType;

	@IsOptional()
	@Field(() => InquiryStatus, { nullable: true })
	inquiryStatus?: InquiryStatus;

	@IsOptional()
	@Field(() => String, { nullable: true })
	text?: string;
}

@InputType()
export class InquiriesInquiry {
	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	page: number;

	@IsNotEmpty()
	@Min(1)
	@Field(() => Int)
	limit: number;

	@IsOptional()
	@IsIn(availableInquirySorts)
	@Field(() => String, { nullable: true })
	sort?: string;

	@IsOptional()
	@Field(() => Direction, { nullable: true })
	direction?: Direction;

	@IsNotEmpty()
	@Field(() => IISearch)
	search: IISearch;
}
