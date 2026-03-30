import { Field, Float, Int, ObjectType } from '@nestjs/graphql';
import type { ObjectId } from 'mongoose';
import { OrderItemType, OrderStatus, PaymentMethod } from '../../enums/order.enum';
import { TotalCounter } from '../member/member';

@ObjectType()
export class OrderItem {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => Int)
  itemQuantity: number;

  @Field(() => Float)
  itemPrice: number;

  @Field(() => OrderItemType)
  itemType: OrderItemType;

  @Field(() => String)
  orderId: ObjectId;

  @Field(() => String)
  itemId: ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}

@ObjectType()
export class Order {
  @Field(() => String)
  _id: ObjectId;

  @Field(() => Float)
  orderTotal: number;

  @Field(() => Float)
  orderDelivery: number;

  @Field(() => OrderStatus)
  orderStatus: OrderStatus;

  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @Field(() => String)
  memberId: ObjectId;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;

  /* From Aggregation */

  @Field(() => [OrderItem], { nullable: true })
  orderItems?: OrderItem[];
}

@ObjectType()
export class Orders {
  @Field(() => [Order])
  list: Order[];

  @Field(() => [TotalCounter], { nullable: true })
  metaCounter: TotalCounter[];
}