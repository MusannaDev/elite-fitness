import { BadGatewayException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product } from '../../libs/dto/product/product';
import { MemberService } from '../member/member.service';
import { ViewService } from '../view/view.service';
import { LikeService } from '../like/like.service';
import { Message } from '../../libs/enums/common.enum';
import { ProductInput } from '../../libs/dto/product/product.input';

@Injectable()
export class ProductService {
  constructor(@InjectModel
    ("Product") private readonly productModel: Model<Product>,
    private memberService: MemberService,
    private viewService: ViewService,
    private likeService: LikeService,
  ) {}


  public async createProduct(input: ProductInput): Promise<Product> {
    try{
      const result = await this.productModel.create(input);
      // increase properties +1
      await this.memberService.memberStatsEditor({
        _id: result.memberId,
        targetKey: 'memberProperties',
        modifier: 1,
      });

      return result;
    } catch(err) {
      console.log('Error, Service.model:', err.message);
      throw new BadGatewayException(Message.CREATE_FAILED);
    }
  }
}
