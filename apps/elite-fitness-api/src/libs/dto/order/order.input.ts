import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import type { ObjectId } from 'mongoose';
import { OrderItemType, OrderStatus, PaymentMethod } from '../../enums/order.enum';

@InputType()
export class OrderItemInput {
  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @Field(() => Int)
  itemQuantity: number;

  @IsNotEmpty()
  @Field(() => Float)
  itemPrice: number;

  @IsNotEmpty()
  @IsEnum(OrderItemType)
  @Field(() => OrderItemType)
  itemType: OrderItemType;

  @IsNotEmpty()
  @Field(() => String)
  itemId: ObjectId;
}

@InputType()
export class OrderInput {
  @IsNotEmpty()
  @Field(() => Float)
  orderDelivery: number;

  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  @Field(() => PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsNotEmpty()
  @Field(() => [OrderItemInput])
  orderItems: OrderItemInput[];

  memberId?: ObjectId;
}

@InputType()
class OISearch {
  @IsOptional()
  @IsEnum(OrderStatus)
  @Field(() => OrderStatus, { nullable: true })
  orderStatus?: OrderStatus;
}

@InputType()
export class OrderInquiry {
  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  page: number;

  @IsNotEmpty()
  @Min(1)
  @Field(() => Int)
  limit: number;

  @IsOptional()
  @Field(() => OISearch, { nullable: true })
  search?: OISearch;

  @IsOptional()
  @IsEnum(OrderStatus)
  @Field(() => OrderStatus, { nullable: true })
  orderStatus?: OrderStatus;
}
