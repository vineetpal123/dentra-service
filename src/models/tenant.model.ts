import mongoose, { Document, Schema } from 'mongoose';

export interface ITenant extends Document {
  name: string;
  ownerId: mongoose.Types.ObjectId;
  plan: 'free' | 'pro' | 'enterprise';
}

const tenantSchema = new Schema<ITenant>(
  {
    name: { type: String, required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
    plan: {
      type: String,
      enum: ['free', 'pro', 'enterprise'],
      default: 'free',
    },
  },
  { timestamps: true },
);

export const Tenant = mongoose.model<ITenant>('Tenant', tenantSchema);
