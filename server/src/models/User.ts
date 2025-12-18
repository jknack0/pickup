import mongoose, { Schema, Document } from 'mongoose';
import { RegisterInput } from '@pickup/shared';
import bcrypt from 'bcrypt';

export interface IUser extends Omit<RegisterInput, 'dateOfBirth' | 'confirmPassword'>, Document {
  passwordHash: string;
  dateOfBirth: Date;
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    dateOfBirth: { type: Date, required: true },
  },
  { timestamps: true },
);

UserSchema.pre<IUser>('save', async function () {
  if (!this.isModified('passwordHash')) return;
  const salt = await bcrypt.genSalt(10);
  this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

export default mongoose.model<IUser>('User', UserSchema);
