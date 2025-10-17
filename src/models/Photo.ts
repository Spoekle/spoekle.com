import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPhoto extends Document {
  title: string;
  description?: string;
  imageUrl: string;
  thumbnailUrl: string;
  category: 'Nature' | 'Urban' | 'Travel' | 'Portrait' | 'Other';
  metadata?: {
    camera?: string;
    lens?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: string;
    focalLength?: string;
    takenAt?: Date;
    location?: string;
    gpsLocation?: {
      latitude: number;
      longitude: number;
    };
    width?: number;
    height?: number;
    format?: string;
  };
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const photoSchema = new Schema<IPhoto>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    default: '',
    trim: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Nature', 'Urban', 'Travel', 'Portrait', 'Other'],
    default: 'Other',
  },
  metadata: {
    camera: String,
    lens: String,
    aperture: String,
    shutterSpeed: String,
    iso: String,
    focalLength: String,
    takenAt: Date,
    location: String,
    gpsLocation: {
      latitude: Number,
      longitude: Number,
    },
    width: Number,
    height: Number,
    format: String,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, // This will automatically create createdAt and updatedAt
});

const Photo: Model<IPhoto> = mongoose.models.Photo || mongoose.model<IPhoto>('Photo', photoSchema);

export default Photo;
