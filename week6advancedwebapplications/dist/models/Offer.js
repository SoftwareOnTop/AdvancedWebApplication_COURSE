import mongoose, { Schema } from 'mongoose';
const OfferSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    imageId: { type: String, required: false }
});
const Offer = mongoose.model("Offer", OfferSchema);
export { Offer };
