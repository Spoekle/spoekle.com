import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email?: string;
  password: string;
  profilePicture?: string;
  roles: string[];
  status: 'disabled' | 'active';
  discordId?: string;
  discordUsername?: string;
  isApproved: boolean;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String, required: true },
  profilePicture: { 
    type: String,
    default: '/assets/profile_placeholder.png' 
  },
  roles: { 
    type: [String], 
    enum: ['admin', 'user', 'editor'], 
    default: ['user'], 
    required: true 
  },
  status: { type: String, enum: ['disabled', 'active'], default: 'active' },
  discordId: { type: String, unique: true, sparse: true },
  discordUsername: { type: String },
  isApproved: { type: Boolean, default: true },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;
