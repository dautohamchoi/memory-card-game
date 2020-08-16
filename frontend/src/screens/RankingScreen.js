import React, { useState, useEffect } from 'react'
import NavBar from '../components/Navbar';
import { useDispatch, useSelector } from 'react-redux';
import { listRanking } from '../actions/rankingAction';
import calculateLevel from '../functions/calculateLevel';

function RankingScreen(props) {
    const rankingList = useSelector(state => state.rankingList);
    const { users, loading, error } = rankingList;
    
    const [sortOrder, setSortOrder] = useState('highScore');

    const buttons = document.querySelectorAll('.ranking-order-btn');

    const dispatch = useDispatch();


    const getHighScoreList = (e) => {
        setSortOrder('highScore');
        buttons.forEach(btn => {
            btn.classList.remove('ranking-active');
        })
        const buttonClicked = e.target;
        buttonClicked.classList.add('ranking-active');
    }

    const getLevelScoreList = (e) => {
        setSortOrder('highLevel');
        buttons.forEach(btn => {
            btn.classList.remove('ranking-active');
        })
        const buttonClicked = e.target;
        buttonClicked.classList.add('ranking-active');
    }

    useEffect(() => {
        dispatch(listRanking(sortOrder));
        if (users) {
            for (let i = 0; i < users.length; i++) {
                users[i].currentLevel = calculateLevel(users[i].scoreTotal);
            }
        }
    }, [sortOrder]);


    return (
        <div className="ranking-screen">
            <NavBar></NavBar>
            <div className="ranking-container">
                <div className="ranking-content">
                    <h3>Bảng xếp hạng</h3>
                    <div className="ranking-order">
                        <button className="ranking-order-btn ranking-active"
                        onClick={getHighScoreList}>Điểm số cao</button>
                        <button className="ranking-order-btn"
                        onClick={getLevelScoreList}>Cấp độ cao</button>
                    </div>
                    <table className="ranking-table">
                        <thead>
                            <tr>
                                <th>Hạng</th>
                                <th>Cấp độ</th>
                                <th>Tên nhân vật</th>
                                {
                                    sortOrder === "highScore"
                                    ? <th>Điểm số</th>
                                    : <th>Kinh nghiệm</th>
                                }
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
                                users.map(user => 
                                    <tr key={user._id}>
                                        
                                        {
                                            sortOrder === "highScore" 
                                            ? user.highChallenge === 10
                                                ? <td className="rank-top legendary">{user.scoreRanking}</td>
                                                : <td className="rank-top">{user.scoreRanking}</td>
                                            : user.highChallenge === 10
                                                ? <td className="rank-top legendary">{user.levelRanking}</td>
                                                : <td className="rank-top">{user.levelRanking}</td>

                                        }
                                        <td>
                                            {
                                                <img src={user.image} 
                                                    alt="user-ranking"
                                                    className="ranking-level-image"></img>                                                
                                            }
                                        </td>
                                        <td>{user.name}</td>
                                        {
                                            sortOrder === "highScore" 
                                            ? <td>{user.highScore}</td>
                                            : <td>{user.scoreTotal}</td>
                                        }   
                                    </tr>                                        
                                )
                            }
                        </tbody>
                    </table>                      
                </div>               
            </div>           
        </div>
    )
}

export default RankingScreen;