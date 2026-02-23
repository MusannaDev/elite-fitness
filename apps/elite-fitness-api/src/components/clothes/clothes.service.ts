import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Clothes } from '../../libs/dto/clothes/clothes';
import { Model } from 'mongoose';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';

@Injectable()
export class ClothesService {
  constructor(@InjectModel
    ("Clothes") private readonly clothesModel: Model<Clothes>,
    private memberService: MemberService,
    private viewService: ViewService,
    private likeService: LikeService,
  ) {}
}
