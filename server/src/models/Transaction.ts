import mongoose, { Schema, Document } from 'mongoose';

export interface ITransaction extends Document {
  userId: mongoose.Types.ObjectId;
  eventId: mongoose.Types.ObjectId;
  stripePaymentIntentId?: string;
  stripeTransferId?: string;
  stripeRefundId?: string;
  amount: number; // in cents
  platformFee: number; // in cents
  status: 'PENDING' | 'SUCCEEDED' | 'FAILED' | 'REFUNDED' | 'PARTIALLY_REFUNDED';
  type: 'PAYMENT' | 'REFUND';
  createdAt: Date;
  updatedAt: Date;
}

const TransactionSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    eventId: { type: Schema.Types.ObjectId, ref: 'Event', required: true },
    stripePaymentIntentId: { type: String },
    stripeTransferId: { type: String },
    stripeRefundId: { type: String },
    amount: { type: Number, required: true },
    platformFee: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ['PENDING', 'SUCCEEDED', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'],
      default: 'PENDING',
    },
    type: {
      type: String,
      enum: ['PAYMENT', 'REFUND'],
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model<ITransaction>('Transaction', TransactionSchema);
