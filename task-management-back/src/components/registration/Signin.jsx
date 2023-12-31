import React, { useState } from 'react';
import './registration.scss'; // Import the registration styles
import '../../styles/components/_button.scss'; // Import the button styles
import { useDispatch } from 'react-redux';
import { signin } from '../../redux/authSlice';

const Signin = () => {
  const dispatch = useDispatch();

  const [state, setState] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(
      signin({
        email: state.email,
        password: state.password,
      })
    );
  };

  return (
    <div className='signup-form'>
      <div className='signup-form__wrapper'>
        <form className='form' onSubmit={handleSubmit}>
          <h4>Sign In</h4>
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
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signin;
