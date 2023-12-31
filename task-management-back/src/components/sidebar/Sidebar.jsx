import React from 'react';
import './Sidebar.scss';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const CustomSidebar = () => {
  // Extracting user information from the Redux store
  const { auth } = useSelector((state) => ({ ...state }));
  const { currentUser } = auth;

  return (
    <div>
      {/* Sidebar Navigation */}
      <ul className='custom-sidebar'>
        {/* Displaying the current user's username */}
        <li className='sidebar-item'>
          <h5>{currentUser.username}</h5>
        </li>
        {/* Navigation links */}
        <li className='sidebar-item'>
          <Link to='/dashboard'>Visit Dashboard</Link>
        </li>
        <li className='sidebar-item'>
          <Link to='/settings'>Manage Settings</Link>
        </li>
      </ul>
    </div>
  );
};

export default CustomSidebar;
