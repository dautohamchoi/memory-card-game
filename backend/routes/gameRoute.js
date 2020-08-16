import express from 'express';
import data from '../data';


const router = express.Router();

router.get("/:level", async (req, res) => {
    const gameLevel = req.params.level;
    const game = data.games.find(game => game.level == gameLevel);

    if (game) {
        if (gameLevel == 7) {
            res.send({ cardsSeven: game.cards, question: game.question });
        } else {
            // sending only random cards to the level of game. 
            const cards = game.cards.sort(() => Math.random() - 0.5);
            // arrange the order of cards from lowest to highest
            for (let i = 0; i < game.cards.length; i++) {
                cards[i].id = i;
            }
            res.send(cards);
        }
        
    } else {
        res.status(404).send({ message: "The stage of game do not exist."})
    }
});

export default router;