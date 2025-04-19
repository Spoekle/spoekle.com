// filepath: /data/compose/spoekle.com/backend/src/models/portfolioProjectModel.js
const mongoose = require('mongoose');

const portfolioProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String },
  tags: [String],
  link: { type: String },
  github: { type: String },
  category: { 
    type: String, 
    enum: ['Web Development', 'Applications', 'Open Source', 'Other'], 
    default: 'Web Development' 
  },
  featured: { type: Boolean, default: false },
  order: { type: Number, default: 999 },
  techs: [String] // Store tech icon names that will be mapped to icons in the frontend
}, { timestamps: true });

// Create a text index for searching
portfolioProjectSchema.index({ title: 'text', description: 'text', tags: 'text' });

const PortfolioProject = mongoose.model('PortfolioProject', portfolioProjectSchema);

module.exports = PortfolioProject;
