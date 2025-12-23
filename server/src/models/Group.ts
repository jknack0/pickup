import mongoose, { Schema, Document } from 'mongoose';
import {
  IGroup,
  GroupRole,
  GroupVisibility,
  GroupJoinPolicy,
  MembershipRequestStatus,
  EventType,
} from '@pickup/shared';

export interface IGroupDocument extends Document, Omit<IGroup, '_id'> {
  _id: mongoose.Types.ObjectId;
}

const GroupMemberSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    role: {
      type: String,
      enum: Object.values(GroupRole),
      default: GroupRole.MEMBER,
    },
    joinedAt: { type: Date, default: Date.now },
  },
  { _id: false },
);

const MembershipRequestSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: Object.values(MembershipRequestStatus),
      default: MembershipRequestStatus.PENDING,
    },
    requestedAt: { type: Date, default: Date.now },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewedAt: { type: Date },
  },
  { _id: false },
);

const GroupPaymentSettingsSchema = new Schema(
  {
    defaultPrice: { type: Number },
    defaultCurrency: { type: String, default: 'usd' },
    stripeAccountId: { type: String }, // Synced from owner's User.stripeAccountId
  },
  { _id: false },
);

const GroupSchema: Schema = new Schema(
  {
    name: { type: String, required: true, maxlength: 100 },
    description: { type: String, maxlength: 1000 },
    avatarUrl: { type: String },
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    members: [GroupMemberSchema],
    membershipRequests: [MembershipRequestSchema],
    visibility: {
      type: String,
      enum: Object.values(GroupVisibility),
      default: GroupVisibility.PUBLIC,
    },
    joinPolicy: {
      type: String,
      enum: Object.values(GroupJoinPolicy),
      default: GroupJoinPolicy.OPEN,
    },
    inviteCode: { type: String, unique: true, sparse: true },
    defaultSportTypes: [{ type: String, enum: Object.values(EventType) }],
    location: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    paymentSettings: GroupPaymentSettingsSchema,
  },
  { timestamps: true },
);

// Indexes for efficient queries
GroupSchema.index({ owner: 1 });
GroupSchema.index({ 'members.user': 1 });
GroupSchema.index({ visibility: 1 });
// Note: inviteCode index is already created by unique: true in schema

export default mongoose.model<IGroupDocument>('Group', GroupSchema);
