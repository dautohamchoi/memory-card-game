import React, { useState, useEffect } from 'react'
import NavBar from '../components/Navbar'
import { useDispatch, useSelector } from 'react-redux';
import { saveFeedback, deleteFeedback, listFeedback } from '../actions/feedbackAction';
import Rating from '../components/Rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { CircularProgress } from '@material-ui/core';

function FeedbackScreen(props) {
    const [rating, setRating] = useState('');
    const [comment, setComment] = useState("");
    const [star, setStar] = useState('');

    const userSignin = useSelector(state => state.userSignin)
    const { userInfo } = userSignin;

    const feedbackList = useSelector(state => state.feedbackList);
    const { loading, error, feedbacks, success } = feedbackList;

    const feedbackSave = useSelector(state => state.feedbackSave);
    const { loading: loadingSave, success: successSave } = feedbackSave;

    const feedbackDelete = useSelector(state => state.feedbackDelete);
    const { success: successDelete } = feedbackDelete;

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listFeedback());
        if (success) {
            setStar((feedbacks.reduce((a, c) => a + c.rating, 0) / feedbacks.length).toFixed(1));
        }
        if (successSave) {
            setRating('');
            setComment('');
        } 
    }, [successSave, successDelete]);


    const submitHandler = (e) => {
        e.preventDefault();
        if (comment.length <= 500) {
            if (rating) {
                dispatch(saveFeedback({
                    name: userInfo.name,
                    image: userInfo.image,
                    highScore: userInfo.highScore,
                    rating: rating,
                    comment: comment
                }));
            } else {
                alert("Vùi lòng đánh giá điểm cho trò chơi.")
            }
        } else {
            alert("Giới hạn tối đa ký tự ở phần bình luận là 500.");
        }
    }

    const deleteHandler = (feedback) => {
        dispatch(deleteFeedback(feedback._id));
    }

    return (
        <div className="feedback-screen">
            <NavBar></NavBar>
            <div className="feedback-container">
                <div className="feedback-content">
                    <div className="feedback-header">
                        <div className="fb-header-title">
                            <div>
                                <img src="/characters/reno.png" alt="reno"></img>
                                <h3>Hearthstone Memory Card Game</h3>
                            </div>
                            <p>Cảm ơn bạn đã tham gia trò chơi.</p>
                            <p> Xin dành một vài giây để
                                nhận xét để tôi có thể cải thiện trong thời gian tới.</p> 
                        </div>
                        <div>
                            <h3>Đánh giá chung:</h3>
                            {
                                star &&
                                <h3>
                                    {star}/5 &nbsp;
                                    <FontAwesomeIcon icon={faStar} className="rating-star"/>
                                </h3>
                            }
                        </div>
                    </div>
                    <div>
                        
                    </div>
                    <div className="feedback-body">
                        {   
                            loading 
                            ? <div><CircularProgress size={'3rem'}/></div>
                            : error ? <div>{error}</div> 
                            :
                            feedbacks.map(feedback => 
                                <div className="feedback-body-info" key={feedback._id}>
                                    <div className="feedback-info-details">
                                        <img src={feedback.image}
                                        className="level-image" alt="rank"></img>
                                        <div>
                                            <h5>{feedback.name}</h5>
                                            <h6>{feedback.highScore} điểm</h6>
                                        </div>
                                    </div>
                                    <div className="feedback-users-comment">
                                        <div className="users-comment-rating">
                                            <span>
                                                <Rating value={feedback.rating}></Rating>
                                            </span>
                                            <span>
                                                {feedback.createdAt.substring(11, 19)}&nbsp;
                                                {feedback.createdAt.substring(0, 10)}
                                            </span>
                                            {
                                                userInfo.isAdmin &&
                                                <span>
                                                    <button className="feedback-btn-delete"
                                                    onClick={() => deleteHandler(feedback)} >Xoá</button>
                                                </span>
                                            }
                                        </div>
                                        <div className="comment-content">
                                            {feedback.comment}
                                        </div>
                                    </div>
                                </div>                            
                            )
                        }
                    </div>
                    {
                        !successSave ?
                        <form className="feedback-form" onSubmit={submitHandler}>
                            <div className="feedback-form-info">
                                <div>
                                    <img src={userInfo.image} 
                                    alt="rank"></img>
                                    <div>
                                        <h3>{userInfo.name}</h3>
                                        <h5>{userInfo.highScore} điểm</h5>
                                    </div>
                                </div>
                            </div>
                            <ul className="feedback-form-list">
                                <li>
                                    <label htmlFor="rating">Đánh giá về trò chơi</label>
                                    <select name="rating"  id="rating"
                                    onChange={(e) => setRating(e.target.value)} required>
                                        <option disabled selected value>Lựa chọn của bạn</option>
                                        <option value="1">Trò chơi quá tệ. Đánh giá 1 sao.</option>
                                        <option value="2">Trò chơi nhạt, không thú vị. Đánh giá 2 sao.</option>
                                        <option value="3">Trò chơi cũng được. Đánh giá 3 sao.</option>
                                        <option value="4">Trò chơi khá ổn. Đánh giá 4 sao.</option>
                                        <option value="5">Trò chơi phù hợp tốt trong lúc tìm đối thủ. Đánh giá 5 sao.</option>
                                    </select>
                                </li>
                                <li>
                                    <label htmlFor="comment">Bình luận</label>
                                    <textarea type="text" id="comment" 
                                    placeholder="Nhập bình luận..."
                                    name="comment" required 
                                    onChange={(e) => setComment(e.target.value)}
                                    ></textarea>
                                </li>
                                {
                                    loadingSave ? 
                                    <li className="loading">
                                        <CircularProgress size={'3rem'}/>
                                    </li>
                                    :
                                    <li>
                                        <button type="submit">Gửi Bình Luận</button>
                                    </li>
                                }
                            </ul>
                        </form>
                        :
                        <div className="feedback-footer">
                            <img src="/characters/finley.png" alt="thanks"></img>
                            <p>Cảm ơn bạn đã bình luận về trò chơi này.</p>
                        </div>
                    }        
                </div>
            </div>
        </div>
    )
}

export default FeedbackScreen;