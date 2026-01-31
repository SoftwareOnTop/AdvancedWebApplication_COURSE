import mongoose, { Schema, Document } from 'mongoose';

interface IOffer extends Document {
    title: string;
    description: string;
    price: number;
    imageId?: string; 
}

const OfferSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageId: { type: String, required: false } 
});

const Offer = mongoose.model<IOffer>("Offer", OfferSchema);

export {Offer, IOffer};