import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { ProductService } from './product.service';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UseGuards } from '@nestjs/common';
import { MemberType } from '../../libs/enums/member.enum';
import { Product } from '../../libs/dto/product/product';
import { ProductInput } from '../../libs/dto/product/product.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';

@Resolver()
export class ProductResolver {
  constructor(private readonly propertyService: ProductService) {}

  @Roles(MemberType.TRAINER)
  @UseGuards(RolesGuard)
  @Mutation(() => Product)
  public async createProperty(
    @Args('input') input: ProductInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Product> {
    console.log("Mutation: createProperty");
    input.memberId = memberId;
    
    return await this.propertyService.createProduct(input);
  }
}
