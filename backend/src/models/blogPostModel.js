// filepath: /data/compose/spoekle.com/backend/src/models/blogPostModel.js
const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  featuredImage: { type: String },
  excerpt: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  authorId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  publishedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ['draft', 'published'], default: 'published' },
  tags: [String],
}, { timestamps: true });

// Create a text index for searching
blogPostSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Create a pre-save hook to generate a slug if one isn't provided
blogPostSchema.pre('save', function(next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
  next();
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = BlogPost;
