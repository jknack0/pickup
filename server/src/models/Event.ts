import mongoose, { Schema, Document } from 'mongoose';
import { IEvent, EventType, EventFormat, EventPosition, AttendeeStatus } from '@pickup/shared';

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
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
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
  },
  { timestamps: true },
);

export default mongoose.model<IEventDocument>('Event', EventSchema);
