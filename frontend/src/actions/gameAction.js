import axios from 'axios';
import { GAME_LIST_REQUEST, GAME_LIST_SUCCESS, GAME_LIST_FAIL } from '../constants/gameConstants';


const gameAction = (gameLevel) => async (dispatch) => {
    try {
        dispatch({ type: GAME_LIST_REQUEST });
        const { data } = await axios.get("/api/games/" + gameLevel);
        dispatch({ type: GAME_LIST_SUCCESS, payload: data});
    } catch (error) {
        dispatch({ type: GAME_LIST_FAIL, payload: error.message})
    }
}

export { gameAction };