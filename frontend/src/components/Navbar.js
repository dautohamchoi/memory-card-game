import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DropdownProfile from './DropdownProfile';



function NavBar(props) {

    const userSignin = useSelector(state => state.userSignin);
    const { userInfo } = userSignin;



    return (
        <div className="navbar-container">
            <div className="navbar-content">
                <Link to="/" className="nav-left">
                    <img src="/Hearthstone-Logo-mini.png" alt="logo"></img>
                    <span>Memory Card Game</span>
                </Link>
                {
                    userInfo ? 
                    <div className="nav-right">
                      <Link to="/ranking" className="nav-link">Bảng Xếp Hạng</Link>
                      <Link to="/feedback" className="nav-link">Phản hồi</Link>
                        <DropdownProfile userName={userInfo.name}
                            avatar={
                            <img src={userInfo.image} alt="rank"></img>
                          }
                        ></DropdownProfile>                      
                    </div>
                    :
                    <div className="nav-right">
                        <Link to="/register" className="nav-link">Đăng ký</Link>
                        <Link to="/signin" className="nav-link">Đăng nhập</Link>
                    </div>
                }
            </div>

        </div>
    )
}
export default NavBar;