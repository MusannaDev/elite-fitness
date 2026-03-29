import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NoticeService } from './notice.service';
import { Notice, Notices } from '../../../libs/dto/notice/notice';
import { NoticeInput, NoticesInquiry } from '../../../libs/dto/notice/notice.input';
import { NoticeUpdate } from '../../../libs/dto/notice/notice.update';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { WithoutGuard } from '../../auth/guards/without.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthMember } from '../../auth/decorators/authMember.decorator';
import { MemberType } from '../../../libs/enums/member.enum';
import { shapeIntoMongoObjectId } from '../../../libs/config';
import type { ObjectId } from 'mongoose';

@Resolver()
export class NoticeResolver {
  constructor(private readonly noticeService: NoticeService) {}

  /* ADMIN */

  @Roles(MemberType.ADMIN, MemberType.AGENT, MemberType.TRAINER, MemberType.SALESMANAGER)
  @UseGuards(RolesGuard)
  @Mutation(() => Notice)
  public async createNotice(
    @Args('input') input: NoticeInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Notice> {
    console.log('Mutation: createNotice');
    input.memberId = memberId;
    return await this.noticeService.createNotice(input);
  }


  @Roles(MemberType.ADMIN, MemberType.AGENT, MemberType.TRAINER, MemberType.SALESMANAGER)
  @UseGuards(RolesGuard)
  @Mutation(() => Notice)
  public async updateNotice(
    @Args('input') input: NoticeUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Notice> {
    console.log('Mutation: updateNotice');
    input._id = shapeIntoMongoObjectId(input._id);
    return await this.noticeService.updateNotice(memberId, input);
  }


  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Notice)
  public async updateNoticeByAdmin(
    @Args('input') input: NoticeUpdate,
  ): Promise<Notice> {
    console.log('Mutation: updateNoticeByAdmin');
    input._id = shapeIntoMongoObjectId(input._id);
    return await this.noticeService.updateNoticeByAdmin(input);
  }

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Notice)
  public async removeNoticeByAdmin(
    @Args('noticeId') input: string,
  ): Promise<Notice> {
    console.log('Mutation: removeNoticeByAdmin');
    const noticeId = shapeIntoMongoObjectId(input);
    return await this.noticeService.removeNoticeByAdmin(noticeId);
  }

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => Notices)
  public async getNoticesByAdmin(
    @Args('input') input: NoticesInquiry,
  ): Promise<Notices> {
    console.log('Query: getNoticesByAdmin');
    return await this.noticeService.getNoticesByAdmin(input);
  }

  /* USER (public) */

  @UseGuards(WithoutGuard)
  @Query(() => Notices)
  public async getNotices(
    @Args('input') input: NoticesInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Notices> {
    console.log('Query: getNotices');
    return await this.noticeService.getNotices(input);
  }

  @UseGuards(WithoutGuard)
  @Query(() => Notice)
  public async getNotice(
    @Args('noticeId') input: string,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Notice> {
    console.log('Query: getNotice');
    const noticeId = shapeIntoMongoObjectId(input);
    return await this.noticeService.getNotice(noticeId);
  }
}