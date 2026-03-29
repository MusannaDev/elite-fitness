import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Notice, Notices } from '../../../libs/dto/notice/notice';
import { NoticeInput, NoticesInquiry } from '../../../libs/dto/notice/notice.input';
import { NoticeUpdate } from '../../../libs/dto/notice/notice.update';
import { NoticeStatus } from '../../../libs/enums/notice.enum';
import { Message, Direction } from '../../../libs/enums/common.enum';
import { T } from '../../../libs/types/common';

@Injectable()
export class NoticeService {
  constructor(
    @InjectModel('Notice') private readonly noticeModel: Model<Notice>,
  ) {}

  /* ADMIN */

  public async createNotice(input: NoticeInput): Promise<Notice> {
    try {
      return await this.noticeModel.create(input);
    } catch (err) {
      console.log('Error, NoticeService.createNotice:', err.message);
      throw new BadRequestException(Message.CREATE_FAILED);
    }
  }


  public async updateNotice(memberId: ObjectId, input: NoticeUpdate): Promise<Notice> {
    const search: T = {
      _id: input._id,
      memberId: memberId,
      noticeStatus: NoticeStatus.ACTIVE,
    };

    const result = await this.noticeModel
      .findOneAndUpdate(search, input, { new: true })
      .exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
    return result;
  }


  public async updateNoticeByAdmin(input: NoticeUpdate): Promise<Notice> {
    const search: T = {
      _id: input._id,
      noticeStatus: NoticeStatus.ACTIVE,
    };

    const result = await this.noticeModel
      .findOneAndUpdate(search, input, { new: true })
      .exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
    return result;
  }

  public async removeNoticeByAdmin(noticeId: ObjectId): Promise<Notice> {
    const search: T = {
      _id: noticeId,
      noticeStatus: NoticeStatus.DELETE,
    };

    const result = await this.noticeModel.findOneAndDelete(search).exec();
    if (!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
    return result;
  }

  public async getNoticesByAdmin(input: NoticesInquiry): Promise<Notices> {
    const { noticeCategory, noticeStatus, text } = input.search;
    const match: T = {};
    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    if (noticeCategory) match.noticeCategory = noticeCategory;
    if (noticeStatus) match.noticeStatus = noticeStatus;
    if (text) match.noticeTitle = { $regex: new RegExp(text, 'i') };

    const result = await this.noticeModel
      .aggregate([
        { $match: match },
        { $sort: sort },
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

    if (!result.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    return result[0];
  }

  /* USER (public) */

  public async getNotices(input: NoticesInquiry): Promise<Notices> {
    const { noticeCategory, text } = input.search;
    const match: T = { noticeStatus: NoticeStatus.ACTIVE };
    const sort: T = {
      [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC,
    };

    if (noticeCategory) match.noticeCategory = noticeCategory;
    if (text) match.noticeTitle = { $regex: new RegExp(text, 'i') };

    const result = await this.noticeModel
      .aggregate([
        { $match: match },
        { $sort: sort },
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

    if (!result.length)
      throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    return result[0];
  }

  public async getNotice(noticeId: ObjectId): Promise<Notice> {
    const result = await this.noticeModel
      .findOne({ _id: noticeId, noticeStatus: NoticeStatus.ACTIVE })
      .lean()
      .exec();

    if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    return result;
  }
}