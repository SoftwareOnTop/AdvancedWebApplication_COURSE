import mongoose, { Schema } from 'mongoose';
const ImageSchema = new Schema({
    filename: { type: String, required: true },
    path: { type: String, required: true }
});
const Image = mongoose.model('Image', ImageSchema);
export { Image };
