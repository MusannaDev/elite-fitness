import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InquiryResolver } from './inquiry.resolver';
import { InquiryService } from './inquiry.service';
import { AuthModule } from '../../auth/auth.module';
import InquirySchema from '../../../schemas/Inquiry.model';

@Module({
	imports: [
		MongooseModule.forFeature([{ name: 'Inquiry', schema: InquirySchema }]),
		AuthModule,
	],
	providers: [InquiryResolver, InquiryService],
	exports: [InquiryService],
})
export class InquiryModule {}
