import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../actions/userAction';


function DropdownProfile(props) {
    const [open, setOpen] = useState(false);


    function DropdownMenu(props) {

        function LogOut(props) {
            const dispatch = useDispatch();
            const signOut = () => {
              dispatch(logout());
              window.location.reload(false);
            }
            return (
              <div  className="menu-item" onClick={signOut} >
                {props.children}
              </div>
            )
        }

        function DropdownItem(props) {
            return (
                <div  className="menu-item">
                        {props.children}
                </div>
            )
        }

        return (
            <div className="drop-down">
                        <DropdownItem>
                            <Link to="/profile"
                            className="dropdown-link"
                            >Thông tin cá nhân</Link>
                        </DropdownItem>
                        <LogOut>
                            <Link to="/"
                            className="dropdown-link"
                            >Đăng xuất</Link>
                        </LogOut>                    
             </div>
        )
    }


    return (
        <div className="nav-link" onClick={() => setOpen(!open)}>
            {props.avatar}
            {props.userName}
            { 
                open &&  <DropdownMenu></DropdownMenu>
            }
        </div>
    )
}

export default DropdownProfile;
