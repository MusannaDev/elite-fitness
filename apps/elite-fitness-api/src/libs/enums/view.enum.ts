import { registerEnumType } from '@nestjs/graphql';

export enum ViewGroup {
	MEMBER = 'MEMBER',
	ARTICLE = 'ARTICLE',
	PROPERTY = 'PROPERTY',
	PRODUCT = 'PRODUCT',
	CLOTHES = 'CLOTHES',
	EQUIPMENT = 'EQUIPMENT',
}
registerEnumType(ViewGroup, {
	name: 'ViewGroup',
});
