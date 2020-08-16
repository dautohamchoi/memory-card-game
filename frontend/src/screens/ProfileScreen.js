import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDumbbell, faArrowAltCircleRight, faBell, faEyeSlash, 
    faEye, faUser, faCrown } from '@fortawesome/free-solid-svg-icons';
import { useSelector, useDispatch } from 'react-redux';
import { listRanking } from '../actions/rankingAction';
import calculateLevel from '../functions/calculateLevel';
import setNameLevel from '../functions/setNameLevel';

function ProfileScreen(props) {
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;


    const rankingList = useSelector(state => state.rankingList);
    const { users, loading, error } = rankingList;

    const [open, setOpen] = useState(false);
    const [level, setLevel] = useState(0);

    const dispatch = useDispatch();

    useEffect(() => {
        // get a list of highScore ranking
        dispatch(listRanking('highScore'));
        if (userInfo) {
            setLevel(
                setNameLevel(calculateLevel(userInfo.scoreTotal))
            );
        }
    }, []);

    return (
        <div className="profile-screen">
            <div>
                <Navbar></Navbar> 
                <div className="profile-container">
                    <div className="profile-box">
                        <div className="profile-content">
                            <div className="profile-title">
                                <img src="/mind_tech.png" alt="hero"
                                className="profile-hero"></img>
                                <p>Xin chào <b>{userInfo.name}</b>.
                                    <span> Hãy nhấn "Bắt đầu" ở bên phải 
                                    để khám phá các thử thách 
                                    </span> 
                                </p>
                            </div>
                            <div className="profile-action">
                                <Link to="/training" className="profile-link training-btn">
                                    <FontAwesomeIcon icon={faDumbbell}></FontAwesomeIcon>
                                    &nbsp;Tập luyện</Link>
                                <Link className="profile-link start-btn" to="/games/1">Bắt đầu &nbsp;
                                    <FontAwesomeIcon icon={faArrowAltCircleRight}></FontAwesomeIcon>
                                </Link>
                            </div>
                        </div>
                        <div className="profile-notification">
                            <div>
                                <h3>
                                    <FontAwesomeIcon icon={faBell}></FontAwesomeIcon>
                                    &nbsp; Thông báo
                                </h3>
                                {
                                    open && 
                                    <div>
                                        <p>Lời đầu tiên xin cảm ơn các anh/chị/em trong nhóm Hearthstone Vietnam 
                                        đã tham gia chơi trả nghiệm trò chơi này.
                                        </p>
                                        <p>Vì vậy, em có món quà nhỏ để tặng đến mọi người.</p>
                                        <p><b>Phần thưởng: </b>01 thẻ nạp điện thoại 20k.
                                        </p>
                                        <p><b>Điều kiện nhận thưởng: </b>Tài khoản thuộc <b>Top 3</b> Bảng xếp hạng Điểm cao 
                                            hoặc Cấp độ.
                                        </p>
                                        <p>Thời gian chốt dữ liệu và trao giải: <b>22 giờ ngày 16/08/2020</b>.</p>
                                    </div>
                                }
                                {
                                    open &&
                                    <button onClick={() => setOpen(!open)}>
                                        <FontAwesomeIcon icon={faEyeSlash}></FontAwesomeIcon>
                                        &nbsp; Ẩn
                                    </button>
                                }
                                    {
                                    !open &&
                                    <button onClick={() => setOpen(!open)}>
                                        <FontAwesomeIcon icon={faEye}></FontAwesomeIcon>
                                        &nbsp; Hiển thị
                                    </button>
                                }
                            </div>
                        </div>
                        <div className="profile-main">
                            <div className="profile-main-info">
                                <h4>
                                    <FontAwesomeIcon icon={faUser} />
                                    &nbsp; Thông tin cá nhân
                                </h4>
                                <div className="info-details">
                                    <img src={userInfo.image}></img>
                                    <div className="info-details-right">
                                        <div>
                                            <h3>{userInfo.name}</h3>
                                            <h5><i>{level}</i></h5>
                                        </div>
                                    </div>
                                </div>
                                <ul>
                                    <li>
                                        <span>Thư điện tử:</span>
                                        <span>{userInfo.email}</span> 
                                    </li>
                                    <li>
                                        <span>Thử thách cao nhất: </span>
                                        <span>{userInfo.highChallenge === 10 ? "Đã tốt nghiệp" : userInfo.highChallenge}</span>
                                    </li>
                                    <li>
                                        <span>Điểm cao nhất:</span>
                                        <span>{userInfo.highScore}</span>
                                    </li>
                                </ul>
                            </div>
                            <div className="profile-main-ranking">
                                <h4>
                                    <FontAwesomeIcon icon={faCrown}/>
                                    &nbsp; Bảng xếp hạng 
                                </h4>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Hạng</th>
                                            <th>Cấp độ</th>
                                            <th>Tên nhân vật</th>
                                            <th>Điểm số</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            loading ? <tr>
                                                <td colSpan="4">Đang tải...</td>
                                                </tr>
                                                : error ? <tr>
                                                    <td colSpan="4">{error}</td>
                                                    </tr>
                                            :                                            
                                            users.slice(0, 3).map(user => (
                                                <tr key={user._id}>
                                                    {
                                                        user.highChallenge === 10 
                                                        ? <td className="rank-top legendary">{user.scoreRanking}</td>
                                                        : <td className="rank-top">{user.scoreRanking}</td>
                                                    }
                                                    <td>
                                                        <img src={user.image}
                                                        alt="user-ranking"
                                                            className="level-image"></img>
                                                    </td>
                                                    <td>{user.name}</td>
                                                    <td>{user.highScore}</td>
                                                </tr>                                                    
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>                        
                    </div>
                </div> 
            </div>
        </div>
    )
}

export default ProfileScreen;