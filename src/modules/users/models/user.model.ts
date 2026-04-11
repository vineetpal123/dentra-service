import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'admin' | 'doctor' | 'staff';

export interface IUser extends Document {
  mobile: string;
  tenantId: mongoose.Types.ObjectId;
  name?: string;
  role: UserRole;
  isApproved: boolean;
  isDeleted: boolean;
}

const userSchema = new Schema<IUser>(
  {
    mobile: { type: String, required: true, index: true },

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
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true },
);

// Prevent duplicate user in same tenant
userSchema.index({ mobile: 1, tenantId: 1 }, { unique: true });

export const User = mongoose.model<IUser>('User', userSchema);
