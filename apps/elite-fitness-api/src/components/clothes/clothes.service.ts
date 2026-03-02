import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Clothe, Clothes } from '../../libs/dto/clothes/clothes';
import { Model, ObjectId } from 'mongoose';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import { AllClotheInquiry, ClotheInput, ClotheInquiry, ClotheOrdinaryInquiry, SalesManagerClotheInquiry } from '../../libs/dto/clothes/clothes.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';
import { LikeInput } from '../../libs/dto/like/like.input';
import { LikeGroup } from '../../libs/enums/like.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { ClotheStatus } from '../../libs/enums/clothes.enum';
import { ClotheUpdate } from '../../libs/dto/clothes/clothes.update';
import moment from 'moment';

@Injectable()
export class ClothesService {
  constructor(@InjectModel
    ("Clothes") private readonly clothesModel: Model<Clothe>,
    private memberService: MemberService,
    private viewService: ViewService,
    private likeService: LikeService,
  ) {}


  public async createClothe(input: ClotheInput): Promise<Clothe> {
    try{
      const result = await this.clothesModel.create(input);
      // increase properties +1
      await this.memberService.memberStatsEditor({
        _id: result.memberId,
        targetKey: 'memberClothes',
        modifier: 1,
      });

      return result;
    } catch(err) {
      console.log('Error, Service.model:', err.message);
      throw new BadGatewayException(Message.CREATE_FAILED);
    }
  }


  public async getClothe(memberId: ObjectId, clotheId: ObjectId): Promise<Clothe> {
    const search: T = {
      _id: clotheId,
      clotheStatus: ClotheStatus.ACTIVE,
    };
    const targetClothe: Clothe = await this.clothesModel.findOne(search).lean().exec();
    if(!targetClothe) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    if(memberId) {
      //record view
      const viewInput = { memberId: memberId, viewRefId: clotheId, viewGroup: ViewGroup.CLOTHES }
      const newView = await this.viewService.recordView(viewInput)
      if (newView) {
        // increase memberView
        await this.clotheStatsEditor({ _id: clotheId, targetKey: 'clotheViews', modifier: 1 });
        targetClothe.clotheViews++
      }

      // Me Liked
      const likeInput: LikeInput = { memberId: memberId, likeRefId: clotheId, likeGroup: LikeGroup.CLOTHES };
      targetClothe.meLiked = await this.likeService.checkLikeExistance(likeInput);
      
    }

    targetClothe.memberData = await this.memberService.getMember(null, targetClothe.memberId);
    return targetClothe;

  }


  public async updateClothe(memberId: ObjectId, input: ClotheUpdate): Promise<Clothe> {
    let { clotheStatus, soldAt, deletedAt } = input;
    const search: T = {
      _id: input._id,
      memberId: memberId,
      clotheStatus: ClotheStatus.ACTIVE,
    };

    if (clotheStatus === ClotheStatus.SOLD) soldAt = moment().toDate();
    else if (clotheStatus === ClotheStatus.DELETE) deletedAt = moment().toDate();

    const result = await this.clothesModel
      .findOneAndUpdate(search, input, {new: true})
      .exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

    if (soldAt || deletedAt) {
      await this.memberService.memberStatsEditor({
        _id: memberId,
        targetKey: 'memberClothes',
        modifier: -1,
      });
    }

    return result;
  }


  public async getClothes(memberId: ObjectId, input: ClotheInquiry): Promise<Clothes> {
    const match: T = { clotheStatus: ClotheStatus.ACTIVE };
    const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

    this.shapeMatchQuery(match, input);
    console.log('match:', match);

    const result = await this.clothesModel
      .aggregate([
        { $match: match },
        {
          $facet: {
            list: [
              { $sort: sort },
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
              // meLiked
              lookupAuthMemberLiked(memberId),
              lookupMember,
              { $unwind: '$memberData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();
    if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }
  
  private shapeMatchQuery(match: T, input: ClotheInquiry): void {
    const {
      memberId,
      categoryList,
      materialList,
      sizeList,
      genderList,
      colorList,
      periodsRange,
      pricesRange,
      text,
    } = input.search;

    if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
    if (categoryList && categoryList.length) match.clotheCategory = { $in: categoryList };
    if (materialList && materialList.length) match.clotheMaterial = { $in: materialList };
    if (sizeList && sizeList.length) match.clotheSize = { $in: sizeList };
    if (genderList && genderList.length) match.clotheGender = { $in: genderList };
    if (colorList && colorList.length) match.clotheColor = { $in: colorList };

    if (pricesRange) match.clothePrice = { $gte: pricesRange.start, $lte: pricesRange.end };
    if (periodsRange) match.createdAt = { $gte: periodsRange.start, $lte: periodsRange.end };

    if (text) match.clotheTitle = { $regex: new RegExp(text, 'i') };
  }


  public async getFavorites(
    memberId: ObjectId, input: ClotheOrdinaryInquiry
  ): Promise<Clothes> {
    return await this.likeService.getFavoriteClothes(memberId, input);
  }

  public async getVisited(
    memberId: ObjectId, input: ClotheOrdinaryInquiry
  ): Promise<Clothes> {
    return await this.viewService.getVisitedClothes(memberId, input);
  }



  public async getSalesManagerClothes(memberId: ObjectId, input: SalesManagerClotheInquiry): Promise<Clothes> {
    const { clotheStatus } = input.search;
    if (clotheStatus === ClotheStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);

    const match: T = {
      memberId: memberId,
      clotheStatus: clotheStatus ?? { $ne: ClotheStatus.DELETE },
    };
    const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

    const result = await this.clothesModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
              lookupMember,
              { $unwind: '$memberData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();
    if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }


  public async likeTargetClothe(memberId: ObjectId, likeRefId: ObjectId): Promise<Clothe> {
      const target: Clothe = await this.clothesModel
        .findOne({ _id: likeRefId, clotheStatus: ClotheStatus.ACTIVE })
        .exec();
      if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
  
      const input: LikeInput = {
        memberId: memberId,
        likeRefId: likeRefId,
        likeGroup: LikeGroup.CLOTHES
      };
  
      // LIKE TOGGLE via like modules
      const modifier: number = await this.likeService.toggleLike(input);
      const result = await this.clotheStatsEditor({
        _id: likeRefId,
        targetKey: 'clotheLikes',
        modifier: modifier
      });
      if(!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
  
      return result;
  
    }
  


  /* ADMIN METHODS */


  public async getAllClothesByAdmin(input: AllClotheInquiry): Promise<Clothes> {
    const { clotheStatus, categoryList } = input.search;
    const match: T = {};
    const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };

    if(clotheStatus) match.clotheStatus = clotheStatus;
    if(categoryList) match.clotheCategory = { $in: categoryList };

    const result = await this.clothesModel
      .aggregate([
        { $match: match },
        { $sort: sort },
        {
          $facet: {
            list: [
              { $skip: (input.page - 1) * input.limit },
              { $limit: input.limit },
              lookupMember,
              { $unwind: '$memberData' },
            ],
            metaCounter: [{ $count: 'total' }],
          },
        },
      ])
      .exec();
    if (!result.length) throw new InternalServerErrorException(Message.NO_DATA_FOUND);

    return result[0];
  }
  
  
  public async updateClotheByAdmin(input: ClotheUpdate): Promise<Clothe> {
    let { clotheStatus, soldAt, deletedAt } = input;
    const search: T = {
      _id: input._id,
      clotheStatus: ClotheStatus.ACTIVE,
    };

    if (clotheStatus === ClotheStatus.SOLD) soldAt = moment().toDate();
    else if (clotheStatus === ClotheStatus.DELETE) deletedAt = moment().toDate();

    const result = await this.clothesModel
      .findOneAndUpdate(search, input, {
        new: true,
      })
      .exec();
    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

    if (soldAt || deletedAt) {
      await this.memberService.memberStatsEditor({
        _id: result.memberId,
        targetKey: 'memberClothes',
        modifier: -1,
      });
    }

    return result;
  }

  public async removeClotheByAdmin(propertyId: ObjectId): Promise<Clothe> {
    const search: T = { _id: propertyId, clotheStatus: ClotheStatus.DELETE };
    const result = await this.clothesModel.findOneAndDelete(search).exec();
    if(!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);

    return result;
  }


  public async clotheStatsEditor(input: StatisticModifier): Promise<Clothe> {
    const { _id, targetKey, modifier } = input;
    console.log('executed');
    return await this.clothesModel.findByIdAndUpdate(
      _id,
      { $inc: { [targetKey]: modifier } },
      { new: true, },
    )
    .exec();
  }
}
