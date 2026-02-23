import { registerEnumType } from '@nestjs/graphql';

export enum LikeGroup {
	MEMBER = 'MEMBER',
	PROPERTY = 'PROPERTY',
	ARTICLE = 'ARTICLE',
	PRODUCT = 'PRODUCT',
	CLOTHES = 'CLOTHES',
	EQUIPMENT = 'EQUIPMENT',
}
registerEnumType(LikeGroup, {
	name: 'LikeGroup',
});
