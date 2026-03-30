import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import type { ObjectId } from 'mongoose';
import { OrderService } from './order.service';
import { Order } from '../../libs/dto/order/order';
import { OrderInput, OrderInquiry } from '../../libs/dto/order/order.input';
import { OrderUpdate } from '../../libs/dto/order/order.update';
import { AuthGuard } from '../auth/guards/auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { shapeIntoMongoObjectId } from '../../libs/config';

@Resolver()
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  // ─── Member ───────────────────────────────────────────────

  @UseGuards(AuthGuard)
  @Mutation(() => Order)
  public async createOrder(
    @Args('input') input: OrderInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Order> {
    console.log('Mutation: createOrder');
    input.memberId = memberId;
    return await this.orderService.createOrder(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Query(() => [Order])
  public async getMyOrders(
    @Args('input') input: OrderInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Order[]> {
    console.log('Query: getMyOrders');
    return await this.orderService.getMyOrders(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Mutation(() => Order)
  public async updateOrder(
    @Args('input') input: OrderUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Order> {
    console.log('Mutation: updateOrder');
    input.orderId = shapeIntoMongoObjectId(input.orderId);
    return await this.orderService.updateOrder(memberId, input);
  }

  // ─── Admin ────────────────────────────────────────────────

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query(() => [Order])
  public async getAllOrdersByAdmin(
    @Args('input') input: OrderInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Order[]> {
    console.log('Query: getAllOrdersByAdmin');
    return await this.orderService.getAllOrdersByAdmin(input);
  }

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation(() => Order)
  public async updateOrderByAdmin(
    @Args('input') input: OrderUpdate,
  ): Promise<Order> {
    console.log('Mutation: updateOrderByAdmin');
    input.orderId = shapeIntoMongoObjectId(input.orderId);
    return await this.orderService.updateOrderByAdmin(input);
  }
}