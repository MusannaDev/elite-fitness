import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { View } from '../../libs/dto/view/view';
import { ViewInput } from '../../libs/dto/view/view.input';
import { T } from '../../libs/types/common';
import { OrdinaryInquiry } from '../../libs/dto/property/property.input';
import { Properties } from '../../libs/dto/property/property';
import { ViewGroup } from '../../libs/enums/view.enum';
import { lookupVisited } from '../../libs/config';
import { Products } from '../../libs/dto/product/product';
import { ProductOrdinaryInquiry } from '../../libs/dto/product/product.input';
import { BasicInquiry } from '../../libs/dto/equipment/equipment.input';
import { Equipments } from '../../libs/dto/equipment/equipment';

@Injectable()
export class ViewService {
  constructor(@InjectModel("View") private readonly viewModel: Model<View>) {}
  
  public async recordView(input: ViewInput): Promise<View | null> {
    const viewEist = await this.checkViewExistance(input);
    if(!viewEist) {
      console.log('- New View Insert -');
      return await this.viewModel.create(input);
    } else return null;
    
  }

  private async checkViewExistance(input: ViewInput): Promise<View> {
    const {memberId, viewRefId} = input;
    const search: T = { memberId: memberId, viewRefId: viewRefId };
    return await this. viewModel.findOne(search).exec()
  }

  public async getVisitedProperties(
    memberId: ObjectId, input: OrdinaryInquiry
  ): Promise<Properties> {
    const {page, limit} = input;
    const match: T = {viewGroup: ViewGroup.PROPERTY, memberId: memberId}

    const data: T = await this.viewModel.aggregate([
      {$match: match},
      {$sort: { updatedAt: -1 }},
      {
        $lookup: {
          from: 'properties',
          localField: 'viewRefId',
          foreignField: '_id',
          as: 'visitedProperty',
        }
      },
      { $unwind: "$visitedProperty" },
      {
        $facet: {
          list: [
            {$skip: (page-1)*limit},
            {$limit: limit},
            lookupVisited,
            { $unwind: "$visitedProperty.memberData" },
          ],
          metaCounter: [{ $count: "total" }],
        },
      },
    ])
    .exec();

    const result: Properties = {list: [], metaCounter: data[0].metaCounter};
    result.list = data[0].list.map((ele) => ele.visitedProperty);
    
    return result;
  }

  public async getVisitedProducts(
    memberId: ObjectId, input: ProductOrdinaryInquiry
  ): Promise<Products> {
    const {page, limit} = input;
    const match: T = {viewGroup: ViewGroup.PRODUCT, memberId: memberId}

    const data: T = await this.viewModel.aggregate([
      {$match: match},
      {$sort: { updatedAt: -1 }},
      {
        $lookup: {
          from: 'products',
          localField: 'viewRefId',
          foreignField: '_id',
          as: 'visitedProduct',
        }
      },
      { $unwind: "$visitedProduct" },
      {
        $facet: {
          list: [
            {$skip: (page-1)*limit},
            {$limit: limit},
            lookupVisited,
            { $unwind: "$visitedProduct.memberData" },
          ],
          metaCounter: [{ $count: "total" }],
        },
      },
    ])
    .exec();

    const result: Products = {list: [], metaCounter: data[0].metaCounter};
    result.list = data[0].list.map((ele) => ele.visitedProduct);
    
    return result;
  }

  /* public async getVisitedClothes(
    memberId: ObjectId, input: OrdinaryInquiry
  ): Promise<Properties> {
    const {page, limit} = input;
    const match: T = {viewGroup: ViewGroup.PROPERTY, memberId: memberId}

    const data: T = await this.viewModel.aggregate([
      {$match: match},
      {$sort: { updatedAt: -1 }},
      {
        $lookup: {
          from: 'properties',
          localField: 'viewRefId',
          foreignField: '_id',
          as: 'visitedProperty',
        }
      },
      { $unwind: "$visitedProperty" },
      {
        $facet: {
          list: [
            {$skip: (page-1)*limit},
            {$limit: limit},
            lookupVisited,
            { $unwind: "$visitedProperty.memberData" },
          ],
          metaCounter: [{ $count: "total" }],
        },
      },
    ])
    .exec();

    const result: Properties = {list: [], metaCounter: data[0].metaCounter};
    result.list = data[0].list.map((ele) => ele.visitedProperty);
    
    return result;
  } */


  public async getVisitedEquipments(
    memberId: ObjectId, input: BasicInquiry
  ): Promise<Equipments> {
    const {page, limit} = input;
    const match: T = {viewGroup: ViewGroup.EQUIPMENT, memberId: memberId}

    const data: T = await this.viewModel.aggregate([
      {$match: match},
      {$sort: { updatedAt: -1 }},
      {
        $lookup: {
          from: 'equipments',
          localField: 'viewRefId',
          foreignField: '_id',
          as: 'visitedEquipment',
        }
      },
      { $unwind: "$visitedEquipment" },
      {
        $facet: {
          list: [
            {$skip: (page-1)*limit},
            {$limit: limit},
            lookupVisited,
            { $unwind: "$visitedEquipment.memberData" },
          ],
          metaCounter: [{ $count: "total" }],
        },
      },
    ])
    .exec();

    const result: Equipments = {list: [], metaCounter: data[0].metaCounter};
    result.list = data[0].list.map((ele) => ele.visitedProperty);
    
    return result;
  } 

}
