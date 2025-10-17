import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IGameDownload {
    title: string;
    description: string;
    downloadUrl: string;
    buttonColor?: string;
}

export interface IGameImage {
    url: string;
    alt: string;
    caption?: string;
}

export interface IGame extends Document {
    id: string;
    name: string;
    shortDescription: string;
    image: string;
    icon: string;
    color: string;
    about: string[];
    review?: string;
    downloads?: IGameDownload[];
    images?: IGameImage[];
    order: number;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const gameDownloadSchema = new Schema<IGameDownload>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    downloadUrl: { type: String, required: true },
    buttonColor: { type: String, default: 'indigo' }
});

const gameImageSchema = new Schema<IGameImage>({
    url: { type: String, required: true },
    alt: { type: String, required: true },
    caption: { type: String }
});

const gameSchema = new Schema<IGame>(
    {
        id: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },
        name: { type: String, required: true },
        shortDescription: { type: String, required: true },
        image: { type: String, required: true },
        icon: { type: String, required: true },
        color: { type: String, required: true },
        about: [{ type: String, required: true }],
        review: { type: String },
        downloads: [gameDownloadSchema],
        images: [gameImageSchema],
        order: { type: Number, default: 0 },
        active: { type: Boolean, default: true },

    }, 
    { timestamps: true }
);

const Game: Model<IGame> = mongoose.models.Game || mongoose.model<IGame>('Game', gameSchema);

export default Game;
