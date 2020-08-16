const { SAVE_FEEDBACK_FAIL, SAVE_FEEDBACK_SUCCESS, SAVE_FEEDBACK_REQUEST, DELETE_FEEDBACK_REQUEST, DELETE_FEEDBACK_SUCCESS, DELETE_FEEDBACK_FAIL, LIST_FEEDBACK_REQUEST, LIST_FEEDBACK_SUCCESS, LIST_FEEDBACK_FAIL } = require("../constants/feedbackConstants");

function FeedbackListReducer(state = { feedbacks: []}, action) {
    switch(action.type) {
        case LIST_FEEDBACK_REQUEST:
            return { loading: true };
        case LIST_FEEDBACK_SUCCESS: 
            return { loading: false, success: true, feedbacks: action.payload };
        case LIST_FEEDBACK_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;    
    }
}

function saveFeedbackReducer(state = { feedbacks: []}, action) {
    switch(action.type) {
        case SAVE_FEEDBACK_REQUEST:
            return { loading: true };
        case SAVE_FEEDBACK_SUCCESS: 
            return { loading: false, success: true, feedbacks: action.payload };
        case SAVE_FEEDBACK_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;    
    }
}

function deleteFeedbackReducer(state = { feedbacks: [] }, action) {
    switch(action.type) {
        case DELETE_FEEDBACK_REQUEST:
            return { loading: true };
        case DELETE_FEEDBACK_SUCCESS: 
            return { loading: false, success: true, feedbacks: action.payload };
        case DELETE_FEEDBACK_FAIL:
            return { loading: false, error: action.payload };
        default:
            return state;    
    }
}

export { saveFeedbackReducer, deleteFeedbackReducer, FeedbackListReducer };