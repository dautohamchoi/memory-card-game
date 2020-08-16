import express from 'express';
import User from '../models/userModel';
import { getToken } from '../util';

var getLevel = require('../functions/getImageLevel.js');


const router = express.Router();

router.get("/ranking", async (req, res) => {
    // const sortOrder = req.query.sortOrder
    //     ? req.query.sortOrder === "highScore"
    //         ? { highScore: -1 }
    //         : { scoreTotal: -1 }
    //     : { _id: 1 };
    if (req.query.sortOrder === "highScore") {
        const users = await User.find({}).sort({ highScore: -1 });
        if (users) {
            for (let i = 0; i < users.length; i++) {
                users[i].scoreRanking = i + 1;
            }
            for (let i = 0; i < users.length; i++) {
                users[i].image = getLevel.getImageLevel(users[i].scoreTotal);
            }
            res.send(users);
        }
    } else if (req.query.sortOrder === "highLevel") {
        const users = await User.find({}).sort({ scoreTotal: -1 });
        if (users) {
            for (let i = 0; i < users.length; i++) {
                users[i].levelRanking = i + 1;
            }
            for (let i = 0; i < users.length; i++) {
                users[i].image = getLevel.getImageLevel(users[i].scoreTotal);
            }
            res.send(users);
        }
    } else {
        const users = await User.find({}).sort({ _id: 1 });
        if (users) {
            res.send(users);
        }
    }  
})

router.put("/:id", async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (user) {
        user.scoreList = [...user.scoreList, req.body.score];
        user.levelList = [...user.levelList, req.body.level];
        user.scoreTotal = user.scoreTotal + req.body.score;
        user.highScore = Math.max(...user.scoreList);
        user.highChallenge = Math.max(...user.levelList);
        user.amountPlay = user.scoreList.length;
        user.image = getLevel.getImageLevel(user.scoreTotal);
        const updatedUser = await user.save();
        res.send({
            _id: updatedUser.id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: getToken(updatedUser),
            scoreList: updatedUser.scoreList,
            levelList: updatedUser.levelList,
            scoreTotal: updatedUser.scoreTotal,
            highScore: updatedUser.highScore,
            highChallenge: updatedUser.highChallenge,
            amountPlay: updatedUser.amountPlay,  
            scoreRanking: updatedUser.scoreRanking,
            levelRanking: updatedUser.levelRanking,
            image: updatedUser.image           
        })
    }
})

router.post("/signin", async (req, res) => {
    const signinUser = await User.findOne({
        email: req.body.email,
        password: req.body.password
    })
    if (signinUser) {
        res.send({
            _id: signinUser.id,
            name: signinUser.name,
            email: signinUser.email,
            isAdmin: signinUser.isAdmin,
            token: getToken(signinUser),
            scoreList: signinUser.scoreList,
            levelList: signinUser.levelList,
            scoreTotal: signinUser.scoreTotal,
            highScore: signinUser.highScore,
            highChallenge: signinUser.highChallenge,
            amountPlay: signinUser.amountPlay,
            scoreRanking: signinUser.scoreRanking,
            levelRanking: signinUser.levelRanking,
            image: signinUser.image   
        })
    } else {
        res.status(404).send({ message: "Either email or password is not correct"})
    }
});

router.post("/register", async (req, res) => {
    const registerUser = await User.findOne({
        email: req.body.email
    });
    if (!registerUser) {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        });
        const newUser = await user.save();
        if (newUser) {
            res.send({
                _id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                isAdmin: newUser.isAdmin,
                token: getToken(newUser),
                scoreList: newUser.scoreList,
                levelList: newUser.levelList,
                scoreTotal: newUser.scoreTotal,
                highScore: newUser.highScore,
                highChallenge: newUser.highChallenge,
                amountPlay: newUser.amountPlay,
                scoreRanking: newUser.scoreRanking,
                levelRanking: newUser.levelRanking,
                image: newUser.image   
            })
        }
    } else {
        res.status(401).send({ message: "Someone is used to create their account by either the name or email. "})
    }
})

router.get("/createAdmin", async (req, res) => {
    try {
        const user = new User({
            name: "dautohamchoi",
            email: "dauto@gmail.com",
            password: "1234",
            isAdmin: true,
            scoreList: [],
            levelList: [],
            scoreTotal: 0,
            highScore: 0,
            highChallenge: 0,
            amountPlay: 0,
            scoreRanking: 0,
            levelRanking: 0,
            image: "/images/Medal_Ranked_Bronze_5.png"  
        });
        const newUser = await user.save();
        res.send(newUser);
    } catch (error) {
        res.send({ message: error.message });
    }
})

export default router;