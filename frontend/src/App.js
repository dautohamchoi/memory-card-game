import React from 'react';
import './App.css';
import { BrowserRouter, Route} from 'react-router-dom'; 
import HomeScreen from './screens/HomeScreen';
import SigninScreen from './screens/SigninScreen';
import RegisterScreen from './screens/RegisterScreen';
import ProfileScreen from './screens/ProfileScreen';
import GameOne from './screens/GameOne';
import GameTwo from './screens/GameTwo';
import GameFive from './screens/GameFive';
import GameSeven from './screens/GameSeven';
import GameSix from './screens/GameSix';
import GameNine from './screens/GameNine';
import GameThree from './screens/GameThree';
import GameFour from './screens/GameFour';
import GameEight from './screens/GameEight';
import { useSelector } from 'react-redux';
import RankingScreen from './screens/RankingScreen';
import FeedbackScreen from './screens/FeedbackScreen';
import TrainingScreen from './screens/TrainingScreen';
import TrainingOne from './training/TrainingOne';
import TrainingTwo from './training/TrainingTwo';
import TrainingThree from './training/TrainingThree';
import TrainingFour from './training/TrainingFour';
import TrainingFive from './training/TrainingFive';
import TrainingSix from './training/TrainingSix';
import TrainingSeven from './training/TrainingSeven';
import TrainingEight from './training/TrainingEight';
import TrainingNine from './training/TrainingNine';


function App() {
  const userSignin = useSelector(state => state.userSignin);
  const { userInfo } = userSignin;

  return (
    <BrowserRouter>
      <main className="App">
        <Route path="/" exact={true} component={HomeScreen}></Route>
        <Route path="/signin" component={SigninScreen}></Route>
        <Route path="/register" component={RegisterScreen}></Route>
        {
          userInfo ?
          <Route path="/profile" component={ProfileScreen}></Route>
          :
          <Route path="/profile" component={SigninScreen}></Route>
        }
        {
          userInfo &&
          <div>
            <Route path="/games/1" component={GameOne}></Route>
            <Route path="/games/2" component={GameTwo}></Route>
            <Route path="/games/3" component={GameThree}></Route>
            <Route path="/games/4" component={GameFour}></Route>
            <Route path="/games/5" component={GameFive}></Route>
            <Route path="/games/6" component={GameSix}></Route>
            <Route path="/games/7" component={GameSeven}></Route>
            <Route path="/games/8" component={GameEight}></Route>
            <Route path="/games/9" component={GameNine}></Route>
            <Route path="/ranking" component={RankingScreen}></Route>
            <Route path="/feedback" component={FeedbackScreen}></Route>
            <Route path="/training" component={TrainingScreen}></Route>
            <Route path="/train/1" component={TrainingOne}></Route>
            <Route path="/train/2" component={TrainingTwo}></Route>
            <Route path="/train/3" component={TrainingThree}></Route>
            <Route path="/train/4" component={TrainingFour}></Route>
            <Route path="/train/5" component={TrainingFive}></Route>
            <Route path="/train/6" component={TrainingSix}></Route>
            <Route path="/train/7" component={TrainingSeven}></Route>
            <Route path="/train/8" component={TrainingEight}></Route>
            <Route path="/train/9" component={TrainingNine}></Route>
          </div>
        }


      </main>    
    </BrowserRouter>
  );
}

export default App;
