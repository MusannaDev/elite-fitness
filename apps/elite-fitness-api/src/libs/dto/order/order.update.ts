import { Field, Float, InputType, Int } from '@nestjs/graphql';
import { IsEnum, IsInt, IsNotEmpty, IsOptional, Min } from 'class-validator';
import type { ObjectId } from 'mongoose';
import { OrderItemType, OrderStatus, PaymentMethod } from '../../enums/order.enum';

@InputType()
export class OrderItemUpdate {
  @IsNotEmpty()
  @Field(() => String)
  _id: ObjectId;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Field(() => Int, { nullable: true })
  itemQuantity?: number;

  @IsOptional()
  @Field(() => Float, { nullable: true })
  itemPrice?: number;

  @IsOptional()
  @IsEnum(OrderItemType)
  @Field(() => OrderItemType, { nullable: true })
  itemType?: OrderItemType;

  @IsOptional()
  @Field(() => String, { nullable: true })
  itemId?: ObjectId;
}

@InputType()
export class OrderUpdate {
  @IsNotEmpty()
  @Field(() => String)
  orderId: ObjectId;

  @IsOptional()
  @IsEnum(OrderStatus)
  @Field(() => OrderStatus, { nullable: true })
  orderStatus?: OrderStatus;

  @IsOptional()
  @Field(() => Float, { nullable: true })
  orderDelivery?: number;

  @IsOptional()
  @IsEnum(PaymentMethod)
  @Field(() => PaymentMethod, { nullable: true })
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @Field(() => [OrderItemUpdate], { nullable: true })
  orderItems?: OrderItemUpdate[];
}