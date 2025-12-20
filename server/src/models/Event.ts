import mongoose, { Schema, Document } from 'mongoose';
import {
  IEvent,
  EventType,
  EventFormat,
  EventPosition,
  AttendeeStatus,
  EventStatus,
} from '@pickup/shared';

export interface IEventDocument extends Document, Omit<IEvent, '_id'> {
  _id: mongoose.Types.ObjectId;
}

const AttendeeSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: Object.values(AttendeeStatus), default: AttendeeStatus.YES },
    positions: [{ type: String, enum: Object.values(EventPosition) }],
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const EventSchema: Schema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    lng: { type: Number },
    price: { type: Number, default: 0 }, // in cents
    currency: { type: String, default: 'usd' },
    isPaid: { type: Boolean, default: false },
    organizer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    attendees: [AttendeeSchema],
    type: {
      type: String,
      enum: Object.values(EventType),
      required: true,
      default: EventType.VOLLEYBALL,
    },
    format: {
      type: String,
      enum: Object.values(EventFormat),
      required: true,
      default: EventFormat.OPEN_GYM,
    },
    status: {
      type: String,
      enum: Object.values(EventStatus),
      required: true,
      default: EventStatus.ACTIVE,
    },
  },
  { timestamps: true },
);

export default mongoose.model<IEventDocument>('Event', EventSchema);
