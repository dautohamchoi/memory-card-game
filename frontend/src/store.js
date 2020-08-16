import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { gameListReducer } from './reducers/gameListReducer';
import { userSigninReducer, userRegisterReducer, userUpdateReducer } from './reducers/userReducer';
import Cookie from 'js-cookie';
import { gameLogReducer } from './reducers/gameLogReducer';
import { rankingListReducer } from './reducers/rankingListReducer';
import { saveFeedbackReducer, deleteFeedbackReducer, FeedbackListReducer } from './reducers/feedbackReducer';


const userInfo = Cookie.getJSON('userInfo') || null;
const gameState = Cookie.getJSON('gameState') || {};

const initialState = {
    userSignin: { userInfo },
    gameLog: { gameState }
};
const reducer = combineReducers({
    gameList: gameListReducer,
    userSignin: userSigninReducer,
    userRegister: userRegisterReducer,
    gameLog: gameLogReducer,
    userUpdate: userUpdateReducer,
    rankingList: rankingListReducer,
    feedbackList: FeedbackListReducer,
    feedbackSave: saveFeedbackReducer,
    feedbackDelete: deleteFeedbackReducer
});

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducer, initialState, composeEnhancer(applyMiddleware(thunk)));

export default store;