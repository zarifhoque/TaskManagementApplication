import React, { useState } from 'react';
import './registration.scss'; // Import the registration styles
import '../../styles/components/_button.scss'; // Import the button styles
import { useDispatch } from 'react-redux';
import { register } from '../../redux/authSlice';

const Signup = () => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    email: '',
    password: '',
    username: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(
      register({
        username: state.username,
        password: state.password,
        email: state.email,
      })
    );
  };

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className='signup-form'>
      <div className='signup-form__wrapper'>
        <form className='form' onSubmit={handleSubmit}>
          <h4>Sign up</h4>
          <div className='form-group'>
            <input
              type='text'
              name='username'
              value={state.username}
              placeholder='Enter Name'
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='email'
              name='email'
              value={state.email}
              placeholder='Enter Email'
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              name='password'
              value={state.password}
              placeholder='Enter Password'
              onChange={handleChange}
            />
          </div>
          <div className='form-group'>
            <button className='button' type='submit'>
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
