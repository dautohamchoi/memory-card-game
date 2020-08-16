import { GAME_LOG, RESET_LOG } from "../constants/gameLogConstants";

function gameLogReducer(state = {}, action) {
    switch (action.type) {
        case GAME_LOG:
            return { gameState: action.payload };
        case RESET_LOG:
            return { gameState: action.payload }    
        default:
            return state;
    }
}

export { gameLogReducer };