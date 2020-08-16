import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        image: { type: String, required: true },
        highScore: { type: Number, required: true },
        rating: { type: Number, required: true, default: 0 },
        comment: { type: String, required: true },
    },
    {
        timestamps: true
    }
);

const feedbackModel = mongoose.model("Feedback", feedbackSchema);

export default feedbackModel;