import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signin } from '../actions/userAction';
import { CircularProgress } from '@material-ui/core';

function SigninScreen(props) {
    // sign in 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const userSignin = useSelector(state => state.userSignin);
    const { loading, userInfo, error } = userSignin;

    const dispatch = useDispatch();

    const redirect = props.location.search ? props.location.search.split("=")[1] : '/profile';
    useEffect(() => {
      if (userInfo) {
        props.history.push(redirect);
      }
      return () => {
        //
      };
    }, [userInfo]);

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(signin(email, password));
    }

    return (
        <div className="home-screen">
            <Navbar></Navbar>
            <form className="signin-container" onSubmit={submitHandler}>
                <ul className="signin-content">
                    <li>
                        <img src="/Hearthstone_logo.png" alt="logo" ></img>
                    </li>
                    <li>
                        {
                            error && 
                            <div className="error">
                                Sai tên tài khoản hoặc mật khẩu !!!
                            </div>
                        }
                    </li>
                    <li>
                        <label htmlFor="email">Tài khoản</label>
                        <input type="text" name="email"
                        id="email" required
                        onChange={(e) => setEmail(e.target.value)}
                        ></input>
                    </li>
                    <li>
                        <label htmlFor="password">Mật khẩu</label>
                        <input type="password" name="password"
                        id="password" required
                        onChange={(e) => setPassword(e.target.value)}
                        ></input>
                    </li>
                    {
                        loading ? 
                        <li className="loading">
                            <CircularProgress size={'3rem'}/>
                        </li>
                        :
                        <li>
                            <button className="signin-button" type="submit"
                            >Đăng nhập</button>
                        </li>
                    }
                    <li>
                        <p>Bạn chưa có tài khoản? <Link
                        to={redirect === "/profile" ? "register" : "register?redirect=" + redirect}
                        >Tạo ngay</Link>.</p>
                    </li>
                </ul>
            </form>
        </div>
    )
}

export default SigninScreen;