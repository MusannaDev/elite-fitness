import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, Length } from 'class-validator';
import { InquiryStatus, InquiryType } from '../../enums/inquiry.enum';
import type { ObjectId } from 'mongoose';

@InputType()
export class InquiryUpdate {
	@IsNotEmpty()
	@Field(() => String)
	_id: ObjectId;

	@IsOptional()
	@Field(() => InquiryType, { nullable: true })
	inquiryType?: InquiryType;

	@IsOptional()
	@Field(() => InquiryStatus, { nullable: true })
	inquiryStatus?: InquiryStatus;

	@IsOptional()
	@Length(3, 100)
	@Field(() => String, { nullable: true })
	inquiryTitle?: string;

	@IsOptional()
	@Length(5, 2000)
	@Field(() => String, { nullable: true })
	inquiryContent?: string;

	@IsOptional()
	@Field(() => [String], { nullable: true })
	inquiryImages?: string[];

	/* Admin only */
	@IsOptional()
	@Field(() => String, { nullable: true })
	adminResponse?: string;
}
