import React from 'react';
import './header.scss'; // Import the header styles
import '../../styles/components/_button.scss'; // Import the button styles
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logoutSuccess } from '../../redux/authSlice';
import history from '../../history';

const Header = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => ({ ...state }));

  const handleLogout = (e) => {
    e.preventDefault();
    dispatch(logoutSuccess());
    localStorage.removeItem('auth');
    history.push('/signin');
    window.location.reload();
  };

  return (
    <div>
      <nav className='header'>
        <div className='header__logo'>
          <h5>Task Manager</h5>
        </div>
        <div className='header__buttons'>
          {auth.currentUser && auth.currentUser.token ? (
            <Link to='/signin' className='button' onClick={handleLogout}>
              Sign Out
            </Link>
          ) : (
            <>
              <Link to='/signin' className='button'>
                Sign In
              </Link>
              <Link to='/signup' className='button'>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Header;
