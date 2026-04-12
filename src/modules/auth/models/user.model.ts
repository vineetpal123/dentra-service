import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'admin' | 'doctor' | 'staff';

export interface IUser extends Document {
  phone: string;
  tenantId: mongoose.Types.ObjectId;
  name?: string;
  role: UserRole;
  isApproved: boolean;
}

const userSchema = new Schema<IUser>(
  {
    phone: { type: String, required: true, index: true },

    tenantId: {
      type: Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },

    name: { type: String },

    role: {
      type: String,
      enum: ['admin', 'doctor', 'staff'],
      default: 'staff',
      index: true,
    },

    isApproved: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Prevent duplicate user in same tenant
userSchema.index({ phone: 1, tenantId: 1 }, { unique: true });

export const User = mongoose.model<IUser>('User', userSchema);
