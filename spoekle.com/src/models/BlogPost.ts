import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IBlogPost extends Document {
  title: string;
  content: string;
  featuredImage?: string;
  excerpt: string;
  slug: string;
  authorId: mongoose.Types.ObjectId;
  publishedDate: Date;
  status: 'draft' | 'published';
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    featuredImage: { type: String },
    excerpt: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    authorId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    publishedDate: { type: Date, default: Date.now },
    status: { type: String, enum: ['draft', 'published'], default: 'published' },
    tags: [String],
  },
  { timestamps: true }
);

// Create a text index for searching
blogPostSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Create a pre-save hook to generate a slug if one isn't provided
blogPostSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

const BlogPost: Model<IBlogPost> =
  mongoose.models.BlogPost || mongoose.model<IBlogPost>('BlogPost', blogPostSchema);

export default BlogPost;
