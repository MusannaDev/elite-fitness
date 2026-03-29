import { Field, InputType, Int } from "@nestjs/graphql";
import { IsIn, IsNotEmpty, IsOptional, Length, Min } from "class-validator";
import { NoticeCategory, NoticeStatus } from "../../enums/notice.enum";
import { Direction } from "../../enums/common.enum";
import { availableNoticeSorts } from "../../config";
import type { ObjectId } from "mongoose";

@InputType()
export class NoticeInput {
  @IsNotEmpty()
  @Field(() => NoticeCategory)
  noticeCategory: NoticeCategory;

  @IsNotEmpty()
  @Length(3, 100)
  @Field(() => String)
  noticeTitle: string;

  @IsNotEmpty()
  @Length(5, 2000)
  @Field(() => String)
  noticeContent: string;

  memberId?: ObjectId;
}

@InputType()
class NIsearch {
  @IsOptional()
  @Field(() => NoticeCategory, { nullable: true })
  noticeCategory?: NoticeCategory;

  @IsOptional()
  @Field(() => NoticeStatus, { nullable: true })
  noticeStatus?: NoticeStatus;

  @IsOptional()
  @Field(() => String, { nullable: true })
  text?: string;
}

@InputType()
export class NoticesInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @IsIn(availableNoticeSorts)
  @Field(() => String, { nullable: true })
  sort?: string;

  @IsOptional()
  @Field(() => Direction, { nullable: true })
  direction?: Direction;

  @IsNotEmpty()
  @Field(() => NIsearch)
  search: NIsearch;
}