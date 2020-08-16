import Cookie from 'js-cookie';
import { GAME_LOG, RESET_LOG } from '../constants/gameLogConstants';



const gameLogAction = (level, score) => (dispatch) => {
    dispatch({ type: GAME_LOG, payload: { level, score} });
    Cookie.set("gameState", JSON.stringify({level, score}));
}

const resetLogAction = () => (dispatch) => {
    dispatch({ type: RESET_LOG, payload: { level: 1, score: 0}});
    Cookie.set("gameState", JSON.stringify({ level: 1, score: 0 }));
}


export { gameLogAction, resetLogAction};