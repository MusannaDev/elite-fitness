import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InquiryService } from './inquiry.service';
import { Inquiry, Inquiries } from '../../../libs/dto/inquiry/inquiry';
import { InquiryInput, InquiriesInquiry } from '../../../libs/dto/inquiry/inquiry.input';
import { InquiryUpdate } from '../../../libs/dto/inquiry/inquiry.update';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthMember } from '../../auth/decorators/authMember.decorator';
import { MemberType } from '../../../libs/enums/member.enum';
import { shapeIntoMongoObjectId } from '../../../libs/config';
import type { ObjectId } from 'mongoose';

@Resolver()
export class InquiryResolver {
	constructor(private readonly inquiryService: InquiryService) {}

	/* USER */

	@UseGuards(AuthGuard)
	@Mutation(() => Inquiry)
	public async createInquiry(
		@Args('input') input: InquiryInput,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Inquiry> {
		console.log('Mutation: createInquiry');
		return await this.inquiryService.createInquiry(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Inquiry)
	public async updateInquiry(
		@Args('input') input: InquiryUpdate,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Inquiry> {
		console.log('Mutation: updateInquiry');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.inquiryService.updateInquiry(memberId, input);
	}

	@UseGuards(AuthGuard)
	@Mutation(() => Inquiry)
	public async deleteInquiry(
		@Args('inquiryId') inquiryId: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Inquiry> {
		console.log('Mutation: deleteInquiry');
		return await this.inquiryService.deleteInquiry(memberId, shapeIntoMongoObjectId(inquiryId));
	}

	@UseGuards(AuthGuard)
	@Query(() => Inquiry)
	public async getInquiry(
		@Args('inquiryId') inquiryId: string,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Inquiry> {
		console.log('Query: getInquiry');
		return await this.inquiryService.getInquiry(memberId, shapeIntoMongoObjectId(inquiryId));
	}

	@UseGuards(AuthGuard)
	@Query(() => Inquiries)
	public async getInquiries(
		@Args('input') input: InquiriesInquiry,
		@AuthMember('_id') memberId: ObjectId,
	): Promise<Inquiries> {
		console.log('Query: getInquiries');
		return await this.inquiryService.getInquiries(memberId, input);
	}

	/* ADMIN */

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Inquiry)
	public async updateInquiryByAdmin(
		@Args('input') input: InquiryUpdate,
	): Promise<Inquiry> {
		console.log('Mutation: updateInquiryByAdmin');
		input._id = shapeIntoMongoObjectId(input._id);
		return await this.inquiryService.updateInquiryByAdmin(input);
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Mutation(() => Inquiry)
	public async removeInquiryByAdmin(
		@Args('inquiryId') inquiryId: string,
	): Promise<Inquiry> {
		console.log('Mutation: removeInquiryByAdmin');
		return await this.inquiryService.removeInquiryByAdmin(shapeIntoMongoObjectId(inquiryId));
	}

	@Roles(MemberType.ADMIN)
	@UseGuards(RolesGuard)
	@Query(() => Inquiries)
	public async getInquiriesByAdmin(
		@Args('input') input: InquiriesInquiry,
	): Promise<Inquiries> {
		console.log('Query: getInquiriesByAdmin');
		return await this.inquiryService.getInquiriesByAdmin(input);
	}
}
