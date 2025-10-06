import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IFeaturedItem extends Document {
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  type: 'project' | 'game' | 'blog' | 'custom';
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const featuredItemSchema = new Schema<IFeaturedItem>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    linkUrl: { type: String, required: true },
    type: { 
      type: String, 
      enum: ['project', 'game', 'blog', 'custom'], 
      default: 'custom' 
    },
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const FeaturedItem: Model<IFeaturedItem> =
  mongoose.models.FeaturedItem || mongoose.model<IFeaturedItem>('FeaturedItem', featuredItemSchema);

export default FeaturedItem;
