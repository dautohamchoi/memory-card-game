import express from 'express';
import Feedback from '../models/feedbackModel';
import { isAuth, isAdmin } from '../util';

const router = express.Router();

router.get("/", async (req, res) => {
    const feedbacks = await Feedback.find({}).sort({ _id: -1});
    res.send(feedbacks);
})

router.post("/", isAuth, async (req, res) => {
    const feedback = new Feedback({
        name: req.body.name,
        image: req.body.image,
        highScore: req.body.highScore,
        rating: Number(req.body.rating),
        comment: req.body.comment        
    }); 
    const saveFeedback = await feedback.save();
    if (saveFeedback) {
        // arrange the order of comment, last users have comments which are appeared first 
        const feedbacks = await Feedback.find({}).sort({ _id: -1});
        res.send(feedbacks);
    } else {
        res.status(404).send({ message: "Cannot save the comment."})
    }
});

router.delete("/:id", isAuth, isAdmin, async (req, res) => {
    const deletedFeedback = await Feedback.findById(req.params.id);
    if (deletedFeedback) {
        await deletedFeedback.remove();
        res.send('Feedback deleted successfully.')
    } else {
        res.send('Error in deletion.');
    }
})

export default router;