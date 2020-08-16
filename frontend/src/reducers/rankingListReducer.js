import { RANKING_REQUEST, RANKING_SUCCESS, RANKING_FAIL } from "../constants/rankingConstants";

function rankingListReducer(state = { users: []}, action) {
    switch (action.type) {
        case RANKING_REQUEST:
            return { loading: true };
        case RANKING_SUCCESS:
            return { loading: false, users: action.payload };
        case RANKING_FAIL:
            return { loading: false, error: action.payload};
        default:
            return state;
    }
}

export { rankingListReducer };