import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPortfolioProject extends Document {
  title: string;
  description: string;
  image?: string;
  tags: string[];
  link?: string;
  github?: string;
  category: 'Web Development' | 'Applications' | 'Open Source' | 'Other';
  featured: boolean;
  order: number;
  techs: string[];
  createdAt: Date;
  updatedAt: Date;
}

const portfolioProjectSchema = new Schema<IPortfolioProject>(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String },
    tags: [String],
    link: { type: String },
    github: { type: String },
    category: {
      type: String,
      enum: ['Web Development', 'Applications', 'Open Source', 'Other'],
      default: 'Web Development',
    },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 999 },
    techs: [String],
  },
  { timestamps: true }
);

// Create a text index for searching
portfolioProjectSchema.index({ title: 'text', description: 'text', tags: 'text' });

const PortfolioProject: Model<IPortfolioProject> =
  mongoose.models.PortfolioProject ||
  mongoose.model<IPortfolioProject>('PortfolioProject', portfolioProjectSchema);

export default PortfolioProject;
