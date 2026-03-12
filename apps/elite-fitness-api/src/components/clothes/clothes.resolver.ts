import { Args, Mutation, Resolver, Query,} from '@nestjs/graphql';
import { ClothesService } from './clothes.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Clothe, Clothes } from '../../libs/dto/clothes/clothes';
import { AllClotheInquiry, ClotheInput, ClotheInquiry, ClotheOrdinaryInquiry, SalesManagerClotheInquiry } from '../../libs/dto/clothes/clothes.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId }  from 'mongoose';
import { WithoutGuard } from '../auth/guards/without.guard';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { ClotheUpdate } from '../../libs/dto/clothes/clothes.update';
import { AuthGuard } from '../auth/guards/auth.guard';

@Resolver()
export class ClothesResolver {
  constructor(private readonly clothesService: ClothesService) {}
  
  @Roles(MemberType.SALESMANAGER)
  @UseGuards(RolesGuard)
  @Mutation(() => Clothe)
  public async createClothe(
    @Args('input') input: ClotheInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Clothe> {
    console.log("Mutation: createClothe");
    input.memberId = memberId;
    
    return await this.clothesService.createClothe(input);
  }

  @UseGuards(WithoutGuard)
  @Query((returns) => Clothe)
  public async getClothe(
    @Args('clotheId') input: string, 
    @AuthMember('_id') memberId: ObjectId
  ): Promise<Clothe> {
    console.log("Query: getClothe");
    const clotheId = shapeIntoMongoObjectId(input)
    return await this.clothesService.getClothe(memberId ,clotheId);
  }

  @Roles(MemberType.SALESMANAGER)
  @UseGuards(RolesGuard)
  @Mutation((returns) => Clothe)
  public async updateClothe(
    @Args('input') input: ClotheUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Clothe> {
    console.log('Mutation: updateProperty');
    input._id = shapeIntoMongoObjectId(input._id);
    return await this.clothesService.updateClothe(memberId, input);
  }


  @UseGuards(WithoutGuard)
  @Query((returns) => Clothes)
  public async getClothes(
    @Args('input') input: ClotheInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Clothes> {
    console.log('Query: getProperties');
    return await this.clothesService.getClothes(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => Clothes)
  public async getFavoriteClothes(
    @Args('input') input: ClotheOrdinaryInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Clothes> {
    console.log('Query: getFavoriteClothes');
    return await this.clothesService.getFavoriteClothes(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => Clothes)
  public async getVisitedClothes(
    @Args('input') input: ClotheOrdinaryInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Clothes> {
    console.log('Query: getVisitedClothes');
    return await this.clothesService.getVisitedClothes(memberId, input);
  }

  @Roles(MemberType.SALESMANAGER)
  @UseGuards(RolesGuard)
  @Query((returns) => Clothes)
  public async getSalesManagerClothes(
    @Args('input') input: SalesManagerClotheInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Clothes> {
    console.log('Query: getSalesManagerClothes');
    return await this.clothesService.getSalesManagerClothes(memberId, input);
  }


  @UseGuards(AuthGuard)
  @Mutation(() => Clothe)
  public async likeTargetClothe
  (@Args('clotheId') input: string, 
  @AuthMember('_id') memberId: ObjectId
  ): Promise<Clothe> {
    console.log("Mutation: likeTargetClothe");
    const likeRefId = shapeIntoMongoObjectId(input)
    return await this.clothesService.likeTargetClothe(memberId, likeRefId);
  } 

  /* ADMIN */

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query((returns) => Clothes)
  public async getAllClothesByAdmin(
    @Args('input') input: AllClotheInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Clothes> {
    console.log('Query: getAllPropertiesByAdmin');
    return await this.clothesService.getAllClothesByAdmin(input);
  }


  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation((returns) => Clothe)
  public async updateClotheByAdmin(@Args('input') input: ClotheUpdate): Promise<Clothe> {
    console.log('Mutation: updateClotheByAdmin');
    input._id = shapeIntoMongoObjectId(input._id);
    return await this.clothesService.updateClotheByAdmin(input);
  }


  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation((returns) => Clothe)
  public async removeClotheByAdmin(@Args('clotheId') input: string): Promise<Clothe> {
    console.log('Mutation: removePropertyByAdmin');
    const clotheId = shapeIntoMongoObjectId(input);
    return await this.clothesService.removeClotheByAdmin(clotheId);
  }
}
