import axios from 'axios';
import { SAVE_FEEDBACK_REQUEST, SAVE_FEEDBACK_SUCCESS, SAVE_FEEDBACK_FAIL,
    DELETE_FEEDBACK_REQUEST, DELETE_FEEDBACK_SUCCESS, DELETE_FEEDBACK_FAIL, LIST_FEEDBACK_REQUEST, LIST_FEEDBACK_SUCCESS, LIST_FEEDBACK_FAIL } from '../constants/feedbackConstants';

const listFeedback = () => async (dispatch) => {
    try {
        dispatch({ type: LIST_FEEDBACK_REQUEST });
        const { data } = await axios.get("/api/feedbacks");
        dispatch({ type: LIST_FEEDBACK_SUCCESS, payload: data});
    } catch (error) {
        dispatch({ type: LIST_FEEDBACK_FAIL, payload: error.message})
    }
}

const saveFeedback = (feedback) => async (dispatch, getState) => {
    try {
        const { userSignin: { userInfo: { token } } } = getState();
        dispatch({ type: SAVE_FEEDBACK_REQUEST, payload: feedback });
        const { data } = await axios.post("/api/feedbacks", 
            feedback, {
                headers: {
                    Authorization: "Bearer " + token
                }
            });
        dispatch({ type: SAVE_FEEDBACK_SUCCESS, payload: data});
    } catch (error) {
        dispatch({ type: SAVE_FEEDBACK_FAIL, payload: error.message})
    }
}

const deleteFeedback = (feedbackId) => async (dispatch, getState) => {
    try {
        const { userSignin: { userInfo: { token } } } = getState();
        dispatch({ type: DELETE_FEEDBACK_REQUEST, payload: feedbackId });
        const { data } = await axios.delete("/api/feedbacks/" + feedbackId, 
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            });
        dispatch({ type: DELETE_FEEDBACK_SUCCESS, payload: data});
    } catch (error) {
        dispatch({ type: DELETE_FEEDBACK_FAIL, payload: error.message})
    }
}

export { saveFeedback, deleteFeedback, listFeedback };