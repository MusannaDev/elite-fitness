import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { EquipmentService } from './equipment.service';
import { Roles } from '../auth/decorators/roles.decorator';
import { MemberType } from '../../libs/enums/member.enum';
import { UseGuards } from '@nestjs/common';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Equipment, Equipments } from '../../libs/dto/equipment/equipment';
import { AllEquipmentsInquiry, EquipmentInput, EquipmentsInquiry, BasicInquiry, SalesManagerEquipmentsInquiry } from '../../libs/dto/equipment/equipment.input';
import { AuthMember } from '../auth/decorators/authMember.decorator';
import type { ObjectId } from 'mongoose';
import { shapeIntoMongoObjectId } from '../../libs/config';
import { EquipmentUpdate } from '../../libs/dto/equipment/equipment.update';
import { AuthGuard } from '../auth/guards/auth.guard';
import { WithoutGuard } from '../auth/guards/without.guard';

@Resolver()
export class EquipmentResolver {
  constructor(private readonly equipmentService: EquipmentService) {}
  
  @Roles(MemberType.SALESMANAGER)
  @UseGuards(RolesGuard)
  @Mutation(() => Equipment)
  public async createEquipment(
    @Args('input') input: EquipmentInput,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Equipment> {
    console.log("Mutation: createProperty");
    input.memberId = memberId;
    
    return await this.equipmentService.createEquipment(input);
  }

  @UseGuards(WithoutGuard)
  @Query((returns) => Equipment)
  public async getEquipment(
    @Args('equipmentId') input: string, 
    @AuthMember('_id') memberId: ObjectId
  ): Promise<Equipment> {
    console.log("Query: getProperty");
    const equipmentId = shapeIntoMongoObjectId(input)
    return await this.equipmentService.getEquipment(memberId, equipmentId);
  }

  @Roles(MemberType.SALESMANAGER)
  @UseGuards(RolesGuard)
  @Mutation((returns) => Equipment)
  public async updateEquipment(
    @Args('input') input: EquipmentUpdate,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Equipment> {
    console.log('Mutation: updateProperty');
    input._id = shapeIntoMongoObjectId(input._id);
    return await this.equipmentService.updateEquipment(memberId, input);
  }


  @UseGuards(WithoutGuard)
  @Query((returns) => Equipments)
  public async getEquipments(
    @Args('input') input: EquipmentsInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Equipments> {
    console.log('Query: getProperties');
    return await this.equipmentService.getEquipments(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => Equipments)
  public async getLikedEquipments(
    @Args('input') input: BasicInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Equipments> {
    console.log('Query: getLikedEquipments');
    return await this.equipmentService.getLikedEquipments(memberId, input);
  }

  @UseGuards(AuthGuard)
  @Query((returns) => Equipments)
  public async getSeenEquipments(
    @Args('input') input: BasicInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Equipments> {
    console.log('Query: getVisited');
    return await this.equipmentService.getSeenEquipments(memberId, input);
  }

  @Roles(MemberType.SALESMANAGER)
  @UseGuards(RolesGuard)
  @Query((returns) => Equipments)
  public async getSalesManagerEquipments(
    @Args('input') input: SalesManagerEquipmentsInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Equipments> {
    console.log('Query: getSalesManagerEquipments');
    return await this.equipmentService.getSalesManagerEquipments(memberId, input);
  }


  @UseGuards(AuthGuard)
  @Mutation(() => Equipment)
  public async likeTargetEquipment
  (@Args('equipmentId') input: string, 
  @AuthMember('_id') memberId: ObjectId
  ): Promise<Equipment> {
    console.log("Mutation: likeTargetEquipment");
    const likeRefId = shapeIntoMongoObjectId(input)
    return await this.equipmentService.likeTargetEquipment(memberId, likeRefId);
  } 

  /* ADMIN */

  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Query((returns) => Equipments)
  public async getAllEquipmentsByAdmin(
    @Args('input') input: AllEquipmentsInquiry,
    @AuthMember('_id') memberId: ObjectId,
  ): Promise<Equipments> {
    console.log('Query: getAllEquipmentsByAdmin');
    return await this.equipmentService.getAllEquipmentsByAdmin(input);
  }


  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation((returns) => Equipment)
  public async updateEquipmentByAdmin(@Args('input') input: EquipmentUpdate): Promise<Equipment> {
    console.log('Mutation: updateEquipment');
    input._id = shapeIntoMongoObjectId(input._id);
    return await this.equipmentService.updateEquipmentByAdmin(input);
  }


  @Roles(MemberType.ADMIN)
  @UseGuards(RolesGuard)
  @Mutation((returns) => Equipment)
  public async removeEquipmentByAdmin(@Args('propertyId') input: string): Promise<Equipment> {
    console.log('Mutation: removeEquipmentByAdmin');
    const equipmentId = shapeIntoMongoObjectId(input);
    return await this.equipmentService.removeEquipmentByAdmin(equipmentId);
  }
}
