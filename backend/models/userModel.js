import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, dropDups: true },
    email: { type: String, required: true, unique: true, dropDups: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    scoreList: { type: Array, required: true, default: []},
    levelList: { type: Array, required: true, default: []},
    scoreTotal: { type: Number, default: 0, required: true },
    highScore: { type: Number, default: 0, required: true },
    highChallenge: { type: Number, default: 0, required: true },
    amountPlay: { type: Number, default: 0, required: true },
    scoreRanking: { type: Number, default: 0, required: true },
    levelRanking: { type: Number, default: 0, required: true },
    image: { type: String, default: "/images/Medal_Ranked_Bronze_5.png", required: true }
})

const userModel = mongoose.model("User", userSchema);

export default userModel;