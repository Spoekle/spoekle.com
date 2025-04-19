const mongoose = require('mongoose');

const photoSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: '',
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  thumbnailUrl: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: ['Nature', 'Urban', 'Travel', 'Portrait', 'Other'],
    default: 'Other'
  },
  metadata: {
    camera: String,
    lens: String,
    aperture: String,
    shutterSpeed: String,
    iso: String,
    focalLength: String,
    takenAt: Date,
    location: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

// Update the "updatedAt" field on save
photoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Photo = mongoose.model('Photo', photoSchema);

module.exports = Photo;
