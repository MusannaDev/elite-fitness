import { registerEnumType } from '@nestjs/graphql';

export enum NoticeCategory {
	FAQ = 'FAQ',
	TERMS = 'TERMS',
	ANNOUNCEMENT = 'ANNOUNCEMENT',
	UPDATE = 'UPDATE',
	MAINTENANCE = 'MAINTENANCE',
	PROMOTION = 'PROMOTION',
	POLICY = 'POLICY',
	EVENT = 'EVENT',
	ALERT = 'ALERT',
}
registerEnumType(NoticeCategory, {
	name: 'NoticeCategory',
});

export enum NoticeStatus {
	HOLD = 'HOLD',
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}
registerEnumType(NoticeStatus, {
	name: 'NoticeStatus',
});
