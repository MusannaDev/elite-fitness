import { BadGatewayException, BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Equipment, Equipments } from '../../libs/dto/equipment/equipment';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import { EquipmentInput, EquipmentsInquiry, BasicInquiry, SalesManagerEquipmentsInquiry, AllEquipmentsInquiry } from '../../libs/dto/equipment/equipment.input';
import { Direction, Message } from '../../libs/enums/common.enum';
import { StatisticModifier, T } from '../../libs/types/common';
import { EquipmentStatus } from '../../libs/enums/equipment.enum';
import { ViewGroup } from '../../libs/enums/view.enum';
import { LikeGroup } from '../../libs/enums/like.enum';
import { LikeInput } from '../../libs/dto/like/like.input';
import { EquipmentUpdate } from '../../libs/dto/equipment/equipment.update';
import moment from 'moment';
import { lookupAuthMemberLiked, lookupMember, shapeIntoMongoObjectId } from '../../libs/config';

@Injectable()
export class EquipmentService {
  constructor(@InjectModel
      ("Equipment") private readonly equipmentModel: Model<Equipment>,
      private memberService: MemberService,
      private viewService: ViewService,
      private likeService: LikeService,
    ) {}
  
    
    public async createEquipment(input: EquipmentInput): Promise<Equipment> {
      try{
        const result = await this.equipmentModel.create(input);
        // increase properties +1
        await this.memberService.memberStatsEditor({
          _id: result.memberId,
          targetKey: 'memberProperties',
          modifier: 1,
        });
  
        return result;
      } catch(err) {
        console.log('Error, Service.model:', err.message);
        throw new BadGatewayException(Message.CREATE_FAILED);
      }
    }
  
  
    public async getEquipment(memberId: ObjectId, equipmentId: ObjectId): Promise<Equipment> {
      const search: T = {
        _id: equipmentId,
        equipmentStatus: EquipmentStatus.ACTIVE,
      };
      const targetEquipment: Equipment = await this.equipmentModel.findOne(search).lean().exec();
      if(!targetEquipment) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
  
      if(memberId) {
        //record view
        const viewInput = { memberId: memberId, viewRefId: equipmentId, viewGroup: ViewGroup.EQUIPMENT }
        const newView = await this.viewService.recordView(viewInput)
        if (newView) {
          // increase memberView
          await this.equipmentStatsEditor({ _id: equipmentId, targetKey: 'equipmentViews', modifier: 1 });
          targetEquipment.equipmentViews++
        }
  
        // Me Liked
        const likeInput: LikeInput = { memberId: memberId, likeRefId: equipmentId, likeGroup: LikeGroup.EQUIPMENT };
        targetEquipment.meLiked = await this.likeService.checkLikeExistance(likeInput);
        
      }
  
      targetEquipment.memberData = await this.memberService.getMember(null, targetEquipment.memberId);
      return targetEquipment;
  
    }
  
  
    public async updateEquipment(memberId: ObjectId, input: EquipmentUpdate): Promise<Equipment> {
      let { equipmentStatus, soldAt, deletedAt } = input;
      const search: T = {
        _id: input._id,
        memberId: memberId,
        equipmentStatus: EquipmentStatus.ACTIVE,
      };
  
      if (equipmentStatus === EquipmentStatus.SOLD) soldAt = moment().toDate();
      else if (equipmentStatus === EquipmentStatus.DELETE) deletedAt = moment().toDate();
  
      const result = await this.equipmentModel
        .findOneAndUpdate(search, input, {new: true})
        .exec();
  
      if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
  
      if (soldAt || deletedAt) {
        await this.memberService.memberStatsEditor({
          _id: memberId,
          targetKey: 'memberEquipments',
          modifier: -1,
        });
      }
  
      return result;
    }
  
  
    public async getEquipments(memberId: ObjectId, input: EquipmentsInquiry): Promise<Equipments> {
      const match: T = { equipmentStatus: EquipmentStatus.ACTIVE };
      const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };
  
      this.shapeMatchQuery(match, input);
      console.log('match:', match);
  
      const result = await this.equipmentModel
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
    
    private shapeMatchQuery(match: T, input: EquipmentsInquiry): void {
      const {
        memberId,
        locationList,
        categoryList,
        materialList,
        weightCapacityList,
        periodsRange,
        pricesRange,
        text,
      } = input.search;
  
      if (memberId) match.memberId = shapeIntoMongoObjectId(memberId);
      if (locationList && locationList.length) match.equipmentLocation = { $in: locationList };
      if (categoryList && categoryList.length) match.equipmentCategory = { $in: categoryList };
      if (materialList && materialList.length) match.equipmentMaterial = { $in: materialList };
      if (weightCapacityList && weightCapacityList.length) match.equipmentWeightCapacity = { $in: weightCapacityList };
  
      if (pricesRange) match.propertyPrice = { $gte: pricesRange.start, $lte: pricesRange.end };
      if (periodsRange) match.createdAt = { $gte: periodsRange.start, $lte: periodsRange.end };
  
      if (text) match.equipmentTitle = { $regex: new RegExp(text, 'i') };
    
    }
  
  
    public async getFavorites(
      memberId: ObjectId, input: BasicInquiry
    ): Promise<Equipments> {
      return await this.likeService.getFavoriteEquipments(memberId, input);
    }
  
    public async getVisited(
      memberId: ObjectId, input: BasicInquiry
    ): Promise<Equipments> {
      return await this.viewService.getVisitedEquipments(memberId, input);
    }
  
  
  
    public async getSalesManagerEquipments(memberId: ObjectId, input: SalesManagerEquipmentsInquiry): Promise<Equipments> {
      const { equipmentStatus } = input.search;
      if (equipmentStatus === EquipmentStatus.DELETE) throw new BadRequestException(Message.NOT_ALLOWED_REQUEST);
  
      const match: T = {
        memberId: memberId,
        propertyStatus: equipmentStatus ?? { $ne: EquipmentStatus.DELETE },
      };
      const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };
  
      const result = await this.equipmentModel
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
  
  
    public async likeTargetEquipment(memberId: ObjectId, likeRefId: ObjectId): Promise<Equipment> {
        const target: Equipment = await this.equipmentModel
          .findOne({ _id: likeRefId, equipmentStatus: EquipmentStatus.ACTIVE })
          .exec();
        if (!target) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    
        const input: LikeInput = {
          memberId: memberId,
          likeRefId: likeRefId,
          likeGroup: LikeGroup.EQUIPMENT
        };
    
        // LIKE TOGGLE via like modules
        const modifier: number = await this.likeService.toggleLike(input);
        const result = await this.equipmentStatsEditor({
          _id: likeRefId,
          targetKey: 'equipmentLikes',
          modifier: modifier
        });
        if(!result) throw new InternalServerErrorException(Message.SOMETHING_WENT_WRONG);
    
        return result;
    
      }
    
  
  
    /* ADMIN METHODS */
  
  
    public async getAllEquipmentsByAdmin(input: AllEquipmentsInquiry): Promise<Equipments> {
      const { equipmentStatus, categoryList } = input.search;
      const match: T = {};
      const sort: T = { [input?.sort ?? 'createdAt']: input?.direction ?? Direction.DESC };
  
      if(equipmentStatus) match.propertyStatus = equipmentStatus;
      if(categoryList) match.equipmentCategory = { $in: categoryList };
  
      const result = await this.equipmentModel
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
    
    
    public async updateEquipmentByAdmin(input: EquipmentUpdate): Promise<Equipment> {
      let { equipmentStatus, soldAt, deletedAt } = input;
      const search: T = {
        _id: input._id,
        equipmentStatus: EquipmentStatus.ACTIVE,
      };
  
      if (equipmentStatus === EquipmentStatus.SOLD) soldAt = moment().toDate();
      else if (equipmentStatus === EquipmentStatus.DELETE) deletedAt = moment().toDate();
  
      const result = await this.equipmentModel
        .findOneAndUpdate(search, input, {
          new: true,
        })
        .exec();
      if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
  
      if (soldAt || deletedAt) {
        await this.memberService.memberStatsEditor({
          _id: result.memberId,
          targetKey: 'memberProperties',
          modifier: -1,
        });
      }
  
      return result;
    }
  
    public async removeEquipmentByAdmin(equipmentId: ObjectId): Promise<Equipment> {
      const search: T = { _id: equipmentId, equipmentStatus: EquipmentStatus.DELETE };
      const result = await this.equipmentModel.findOneAndDelete(search).exec();
      if(!result) throw new InternalServerErrorException(Message.REMOVE_FAILED);
  
      return result;
    }
  
  
    public async equipmentStatsEditor(input: StatisticModifier): Promise<Equipment> {
      const { _id, targetKey, modifier } = input;
      console.log('executed');
      return await this.equipmentModel.findByIdAndUpdate(
        _id,
        { $inc: { [targetKey]: modifier } },
        { new: true, },
      )
      .exec();
    }
}
