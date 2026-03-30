import { Schema } from 'mongoose';
import { OrderItemType } from '../libs/enums/order.enum';

const OrderItemSchema = new Schema(
  {
    itemQuantity: {
      type: Number,
      required: true,
    },
    itemPrice: {
      type: Number,
      required: true,
    },
    itemType: {
      type: String,
      enum: OrderItemType,
      required: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Order',
    },
    itemId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: 'itemType',  // dynamic ref: Product | Equipment | Clothes
    },
  },
  { timestamps: true, collection: 'orderItems' },
);

export default OrderItemSchema;