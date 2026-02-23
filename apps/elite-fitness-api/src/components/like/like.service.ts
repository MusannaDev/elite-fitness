import { BadRequestException, Injectable } from '@nestjs/common';
import { Model, ObjectId } from 'mongoose';
import { Like, MeLiked } from '../../libs/dto/like/like';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { BoardArticleService } from '../board-article/board-article.service';
import { PropertyService } from '../property/property.service';
import { InjectModel } from '@nestjs/mongoose';
import { LikeInput } from '../../libs/dto/like/like.input';
import { T } from '../../libs/types/common';
import { Message } from '../../libs/enums/common.enum';
import { OrdinaryInquiry } from '../../libs/dto/property/property.input';
import { Properties } from '../../libs/dto/property/property';
import { LikeGroup } from '../../libs/enums/like.enum';
import { lookupFavorite } from '../../libs/config';
import { Product, Products } from '../../libs/dto/product/product';
import { Equipment, Equipments } from '../../libs/dto/equipment/equipment';
import { BasicInquiry } from '../../libs/dto/equipment/equipment.input'
import { ProductOrdinaryInquiry } from '../../libs/dto/product/product.input';

@Injectable()
export class LikeService {
  constructor(@InjectModel
      ("Like") private readonly likeModel: Model<Like>,
    ) {}

  public async toggleLike(input: LikeInput): Promise<number> {
    const search: T = { memberId: input.memberId, likeRefId: input.likeRefId },
      exist = await this.likeModel.findOne(search).exec();
    let modifier = 1;

    if(exist) {
      await this.likeModel.findOneAndDelete(search).exec();
      modifier = -1;
    } else {
      try {
        await this.likeModel.create(input);
      } catch (err) {
        console.log("Error, Service.Model:", err.message);
        throw new BadRequestException(Message.CREATE_FAILED);
      }
    }

    console.log(`_ Like Modifier${modifier} -`)
    return modifier;
  }

  public async checkLikeExistance(input: LikeInput): Promise<MeLiked[]> {
    const { memberId, likeRefId } = input;
    const result = await this.likeModel.findOne({ memberId: memberId, likeRefId: likeRefId }).exec()

    return result ? [{ memberId: memberId, likeRefId: likeRefId, myFavorite: true }] : [];
  }


  public async getFavoriteProperties(
    memberId: ObjectId, input: OrdinaryInquiry
  ): Promise<Properties> {
    const {page, limit} = input;
    const match: T = {likeGroup: LikeGroup.PROPERTY, memberId: memberId}

    const data: T = await this.likeModel.aggregate([
      {$match: match},
      {$sort: { updatedAt: -1 }},
      {
        $lookup: {
          from: 'properties',
          localField: 'likeRefId',
          foreignField: '_id',
          as: 'favoriteProperty',
        }
      },
      { $unwind: "$favoriteProperty" },
      {
        $facet: {
          list: [
            {$skip: (page-1)*limit},
            {$limit: limit},
            lookupFavorite,
            { $unwind: "$favoriteProperty.memberData" },
          ],
          metaCounter: [{ $count: "total" }],
        },
      },
    ])
    .exec();

    const result: Properties = {list: [], metaCounter: data[0].metaCounter};
    result.list = data[0].list.map((ele) => ele.favoriteProperty);
    
    return result;
  }

  public async getFavoriteProducts(
    memberId: ObjectId, input: ProductOrdinaryInquiry
  ): Promise<Products> {
    const {page, limit} = input;
    const match: T = {likeGroup: LikeGroup.PRODUCT, memberId: memberId}

    const data: T = await this.likeModel.aggregate([
      {$match: match},
      {$sort: { updatedAt: -1 }},
      {
        $lookup: {
          from: 'products',
          localField: 'likeRefId',
          foreignField: '_id',
          as: 'favoriteProduct',
        }
      },
      { $unwind: "$favoriteProduct" },
      {
        $facet: {
          list: [
            {$skip: (page-1)*limit},
            {$limit: limit},
            lookupFavorite,
            { $unwind: "$favoriteProduct.memberData" },
          ],
          metaCounter: [{ $count: "total" }],
        },
      },
    ])
    .exec();

    const result: Products = {list: [], metaCounter: data[0].metaCounter};
    result.list = data[0].list.map((ele) => ele.favoriteProperty);
    
    return result;
  }


  public async getFavoriteEquipments(
    memberId: ObjectId, input: BasicInquiry
  ): Promise<Equipments> {
    const {page, limit} = input;
    const match: T = {likeGroup: LikeGroup.EQUIPMENT, memberId: memberId}

    const data: T = await this.likeModel.aggregate([
      {$match: match},
      {$sort: { updatedAt: -1 }},
      {
        $lookup: {
          from: 'equipments',
          localField: 'likeRefId',
          foreignField: '_id',
          as: 'favoriteEquipment',
        }
      },
      { $unwind: "$favoriteEquipment" },
      {
        $facet: {
          list: [
            {$skip: (page-1)*limit},
            {$limit: limit},
            lookupFavorite,
            { $unwind: "$favoriteEquipment.memberData" },
          ],
          metaCounter: [{ $count: "total" }],
        },
      },
    ])
    .exec();

    const result: Equipments = {list: [], metaCounter: data[0].metaCounter};
    result.list = data[0].list.map((ele) => ele.favoriteProperty);
    
    return result;
  }


}
