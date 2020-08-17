# Hearthstone Memory Card Game

This is a game to express an interest in Hearthstone Vietnam forum. It's also a novel idea for me to practise coding.

## Demo Website:
Link Demo: [https://hearthstone-memory-game.herokuapp.com/](https://hearthstone-memory-game.herokuapp.com/)

## Which stacks I used to create the website ?
- HTML5 and CSS3: Sematic Element and Flexbox
- React: Components, Props, Events, Hooks, Router, Axios, Material-UI
- Redux: Store, Actions, Reducers
- NodeJS: Express, Web API, jsonwebtoken, body-parser, cookie-js.
- MongoDB: Mongoose, Schema
- Development: Babel, ESLint, Git, Github
- Deployment: Heroku

## Features
### Section 1: Sign in and Sign up 
I create a sign-in/sign-up form with minimalist design in folders such as *SigninScreen, RegisterScreen*.
When users type their data on the form, which make a request to the server and waiting a response from it. 
The purpose of this stage is to collect datas from users, which are used to do some stuffs like who will be on top of the ranking,...
![Register](/frontend/Register.png)

### Section 2: User profile
I use Flexbox to create *ProfileScreen* in frontend folder. The profile show users which necessary infomation they need to know, such as their name, ranking, ...
Whenever users back to their profile, they always receive newest data. In the stage, I use Redux to dispatch actions to the server and server will fetch information that I want and send back to store in redux.
![Profile](/frontend/Profile.png)

### Section 3: Game Play 
The game includes two modes:
- **Training**: It provides users a chance to experience all challenges the game have as not all users can overcome all challenges. It's also a place for users who wants to be familiar with the game to improve their scores.
- **Challenges**: This is a real challenges for users. The game includes 9 challenges, the mission of each challenges will change from easy to hard. Users have to pass it in order to explore next challenges.
![GamePlay](/frontend/GamePlay.png)

**Mechanism**

I create a data including source of images, name of images, and their order based on their id. When users click on a hidden card which contains data-id. I will use data-id to find the card in their data to determine whether it matches or not.
![Game7](/frontend/Game7.png)

### Section 4: Ranking
The games have two ranking including:
- **High Score**
- **High Level**
![Ranking](/frontend/Ranking.png)
*Whenever users finish challenges whether they win or loses, they will receive an amount of score equals their experience which can accumulate*.

### Section 5: Feedback
Users can easily leave their feedback about their game, and they can choose which star they want to judge the game.

Admin can simply delete any comment that they think it should be kept or deleted through XOA button on the top of left side.

The feedback form shows us that the average score of the games from feedbacks of users.

![Feedback](/frontend/Feedback.png)
***
## Authors
Facebook: [@dautohamchoi](https://www.facebook.com/dautohamchoi)





