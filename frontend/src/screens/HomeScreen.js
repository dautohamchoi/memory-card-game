import React from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

function HomeScreen(props) {
    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;

    return (
        <div className="home-screen">
            <Navbar></Navbar>
            <div className="home-container">
                <div>
                    <h1>Hearthstone Memory Card Game</h1>
                    <h4>Khám phá khả năng ghi nhớ vô hạn của chính bạn</h4>
                    <button>
                        {
                            userInfo ?
                            <Link to="/profile" className="home-link">Bắt đầu</Link>
                            :
                            <Link to="/signin" className="home-link">Bắt đầu</Link>
                        }
                    </button>
                </div>
            </div>
        </div>
    )
}
export default HomeScreen;