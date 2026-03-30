import { Schema } from 'mongoose';
import { OrderStatus, PaymentMethod } from '../libs/enums/order.enum';

const OrderSchema = new Schema(
  {
    orderTotal: {
      type: Number,
      required: true,
    },
    orderDelivery: {
      type: Number,
      required: true,
      default: 0,
    },
    orderStatus: {
      type: String,
      enum: OrderStatus,
      default: OrderStatus.PENDING,
    },
    paymentMethod: {
      type: String,
      enum: PaymentMethod,
      default: PaymentMethod.CASH,
    },
    memberId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Member',
    },
  },
  { timestamps: true, collection: 'orders' },
);

export default OrderSchema;