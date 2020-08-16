import axios from 'axios';
import { RANKING_REQUEST, RANKING_SUCCESS, RANKING_FAIL } from '../constants/rankingConstants';

const listRanking = (sortOrder = '') => async (dispatch) => {
    try {
        dispatch({ type: RANKING_REQUEST });  
        const { data } = await axios.get("/api/users/ranking?sortOrder=" + sortOrder);
        dispatch({ type: RANKING_SUCCESS, payload: data });
    } catch (error) {
        dispatch({ type: RANKING_FAIL, payload: error.message });
    }
}

export { listRanking };