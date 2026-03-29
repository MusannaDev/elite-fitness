import { registerEnumType } from '@nestjs/graphql';

export enum InquiryType {
	MEMBERSHIP = 'MEMBERSHIP',
	TRAINING = 'TRAINING',
	PRODUCT = 'PRODUCT',
	EQUIPMENT = 'EQUIPMENT',
	PAYMENT = 'PAYMENT',
	GENERAL = 'GENERAL',
}
registerEnumType(InquiryType, {
	name: 'InquiryType',
});

export enum InquiryStatus {
	PENDING = 'PENDING',
	ANSWERED = 'ANSWERED',
	CLOSED = 'CLOSED',
	DELETE = 'DELETE',
}
registerEnumType(InquiryStatus, {
	name: 'InquiryStatus',
});
