import { registerEnumType } from '@nestjs/graphql';

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SHIPPING = 'SHIPPING',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED',
}
registerEnumType(OrderStatus, { name: 'OrderStatus' });


export enum PaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  ONLINE = 'ONLINE',
}
registerEnumType(PaymentMethod, { name: 'PaymentMethod' });

export enum OrderItemType {
  PRODUCT = 'PRODUCT',
  EQUIPMENT = 'EQUIPMENT',
  CLOTHES = 'CLOTHES',
}
registerEnumType(OrderItemType, { name: 'OrderItemType' });