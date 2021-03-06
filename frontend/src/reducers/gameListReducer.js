import { GAME_LIST_REQUEST, GAME_LIST_SUCCESS, GAME_LIST_FAIL } from "../constants/gameConstants";

function gameListReducer(state = { cards: []}, action) {
    switch (action.type) {
        case GAME_LIST_REQUEST:
            return { loading: true };
        case GAME_LIST_SUCCESS:
            return { loading: false, cards: action.payload };
        case GAME_LIST_FAIL:
            return { loading: false, error: action.payload};
        default:
            return state;
    }
}

export { gameListReducer };