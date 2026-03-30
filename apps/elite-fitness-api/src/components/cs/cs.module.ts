import { Module } from '@nestjs/common';
import { NoticeModule } from './notice/notice.module';
import { InquiryModule } from './inquiry/inquiry.module';

@Module({
  imports: [NoticeModule, InquiryModule],
})
export class CsModule {}
