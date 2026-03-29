import { Module } from '@nestjs/common';
import { NoticeModule } from './notice/notice.module';
import { InquiryModule } from './inquiry/inquiry.module';
import { NoticeService } from './notice/notice.service';

@Module({
  imports: [NoticeModule, InquiryModule],
  providers: [NoticeService],
  exports: [NoticeService]
})
export class CsModule {}
