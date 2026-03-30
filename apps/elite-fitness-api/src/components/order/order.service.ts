import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ObjectId } from 'mongoose';
import { Order, Orders } from '../../libs/dto/order/order';
import { OrderInput, OrderInquiry } from '../../libs/dto/order/order.input';
import { OrderUpdate } from '../../libs/dto/order/order.update';
import { OrderStatus } from '../../libs/enums/order.enum';
import { Message } from '../../libs/enums/common.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { MemberService } from '../member/member.service';
import { T } from '../../libs/types/common';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    @InjectModel('OrderItem') private readonly orderItemModel: Model<any>,
    private readonly memberService: MemberService,
  ) {}

  public async createOrder(
    memberId: ObjectId,
    input: OrderInput,
  ): Promise<Order> {
    const amount = input.orderItems.reduce(
      (acc, item) => acc + item.itemPrice * item.itemQuantity,
      0,
    );
    const delivery = amount < 100 ? 5 : 0;

    try {
      const newOrder = await this.orderModel.create({
        memberId,
        orderTotal: amount + delivery,
        orderDelivery: delivery,
        paymentMethod: input.paymentMethod,
      });

      await this.recordOrderItems(newOrder._id, input);
      return newOrder;
    } catch (err) {
      console.log('Error, Service.createOrder:', err.message);
      throw new InternalServerErrorException(Message.CREATE_FAILED);
    }
  }

  private async recordOrderItems(
    orderId: ObjectId,
    input: OrderInput,
  ): Promise<void> {
    const promisedList = input.orderItems.map(async (item) => {
      item.itemId = shapeIntoMongoObjectId(item.itemId);
      await this.orderItemModel.create({ ...item, orderId });
      return 'INSERTED';
    });

    const states = await Promise.all(promisedList);
    console.log('orderItemsState:', states);
  }

  public async getMyOrders(
    memberId: ObjectId,
    input: OrderInquiry,
  ): Promise<Order[]> {
    const { page, limit, orderStatus } = input;
    const match: T = { memberId, orderStatus };

    const result = await this.orderModel
      .aggregate([
        { $match: match },
        { $sort: { updatedAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: 'orderItems',
            localField: '_id',
            foreignField: 'orderId',
            as: 'orderItems',
          },
        },
      ])
      .exec();

    if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    return result;
  }

  public async updateOrder(
    memberId: ObjectId,
    input: OrderUpdate,
  ): Promise<Order> {
    const orderId = shapeIntoMongoObjectId(input.orderId);
    const { orderStatus } = input;

    const result = await this.orderModel
      .findOneAndUpdate(
        { _id: orderId, memberId },
        { $set: { orderStatus } },
        { new: true },
      )
      .exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);

    if (orderStatus === OrderStatus.CONFIRMED) {
      await this.memberService.memberStatsEditor({
        _id: memberId,
        targetKey: 'memberOrders',
        modifier: 1,
      });
    }

    return result;
  }

  /** ADMIN **/

  public async getAllOrdersByAdmin(input: OrderInquiry): Promise<Order[]> {
    const { page, limit, orderStatus } = input;
    const match: T = {};

    if (orderStatus) match.orderStatus = orderStatus;

    const result = await this.orderModel
      .aggregate([
        { $match: match },
        { $sort: { createdAt: -1 } },
        { $skip: (page - 1) * limit },
        { $limit: limit },
        {
          $lookup: {
            from: 'orderItems',
            localField: '_id',
            foreignField: 'orderId',
            as: 'orderItems',
          },
        },
      ])
      .exec();

    if (!result) throw new InternalServerErrorException(Message.NO_DATA_FOUND);
    return result;
  }

  public async updateOrderByAdmin(input: OrderUpdate): Promise<Order> {
    const orderId = shapeIntoMongoObjectId(input.orderId);
    const { orderStatus } = input;

    const result = await this.orderModel
      .findByIdAndUpdate(
        orderId,
        { $set: { orderStatus } },
        { new: true },
      )
      .exec();

    if (!result) throw new InternalServerErrorException(Message.UPDATE_FAILED);
    return result;
  }
}