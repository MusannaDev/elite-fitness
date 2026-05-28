import { registerEnumType } from '@nestjs/graphql';

export enum CommentStatus {
	ACTIVE = 'ACTIVE',
	DELETE = 'DELETE',
}
registerEnumType(CommentStatus, {
	name: 'CommentStatus',
});

export enum CommentGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	PROPERTY = 'PROPERTY',
	PRODUCTS = 'PRODUCTS',
	EQUIPMENTS = 'EQUIPMENTS',
	CLOTHES = 'CLOTHES',
	TRAINERS = 'TRAINERS',
	SALESMANAGERS = 'SALESMANAGERS',
}
registerEnumType(CommentGroup, {
	name: 'CommentGroup',
});
