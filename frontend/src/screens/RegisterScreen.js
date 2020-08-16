import React, { useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../actions/userAction';
import { CircularProgress } from '@material-ui/core';

function RegisterScreen(props) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rePassword, setRePassword] = useState('');

    const [nameRecommend, setNameRecommend] = useState(false);
    const [mailRecommend, setMailRecommend] = useState(false);


    const userRegister = useSelector(state => state.userRegister);
    const { loading, userInfo, error } = userRegister;

    const dispatch = useDispatch();
  
    const redirect = props.location.search ? props.location.search.split("=")[1] : '/signin';
    useEffect(() => {
      if (userInfo) {
        alert("Tạo tài khoản thành công, vui lòng đăng nhập.")
        props.history.push(redirect);
      }
      return () => {
        //
      };
    }, [userInfo]);
  
    const submitHandler = (e) => {
      e.preventDefault();
      if (password === rePassword) {
          if (name.length <= 16) {
            dispatch(register(name, email, password));
          } else {
              alert("Tên nhân vật tối đa 16 ký tự.")
          }

      } else {
          alert("Mật khẩu không trùng khớp");
      }
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
                                Email này đã được sử dụng !
                            </div>
                        }
                    </li>
                    <li>
                        <label htmlFor="email">Địa chỉ Email
                            <FontAwesomeIcon icon={faExclamationCircle} 
                                className="register-icon"
                                onClick={() => setMailRecommend(!mailRecommend)}>
                            </FontAwesomeIcon>
                        </label>
                        {
                            mailRecommend &&
                            <aside className="register-recommend">
                                <p>* Địa chỉ email với mục đích trao giải thưởng.</p>
                            </aside>
                        }
                        <input type="email" name="email"
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
                    <li>
                        <label htmlFor="rePassword">Nhập lại mật khẩu</label>
                        <input type="password" name="rePassword"
                        id="rePassword" required
                        onChange={(e) => setRePassword(e.target.value)}
                        ></input>
                    </li>
                    <li>
                        <label htmlFor="name">Tên nhân vật
                            <FontAwesomeIcon icon={faExclamationCircle} 
                            className="register-icon"
                            onClick={() => setNameRecommend(!nameRecommend)}></FontAwesomeIcon>
                        </label>
                        {
                            nameRecommend && 
                            <aside className="register-recommend">
                                <p>** Đặt theo tên in-game để khoe điểm với bạn bè.</p>
                            </aside>
                        }
                        <input type="text" name="name"
                        id="name" required
                        onChange={(e) => setName(e.target.value)}
                        ></input>
                    </li>
                    {
                        loading ? 
                        <li className="loading">
                            <CircularProgress size={'3rem'}/>
                        </li>
                        :
                        <li>
                            <button className="register-button" type="submit"
                            >Đăng ký</button>
                        </li>
                    }
                    <li>
                        <p>Bạn đã có tài khoản? <Link
                        to={redirect === "/signin" ? "signin" : "signin?redirect=" + redirect}
                        >Đăng nhập ngay</Link>.</p>
                    </li>
                </ul>
            </form>
        </div>
    )
}

export default RegisterScreen;