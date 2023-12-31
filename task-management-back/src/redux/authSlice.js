import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';
import history from '../history';

const initialUser = localStorage.getItem('auth')
  ? JSON.parse(localStorage.getItem('auth'))
  : null;

const initialState = {
  isLoading: false,
  currentUser: initialUser,
  error: null,
};

export const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
    },
    loginFailure: (state, action) => {
      state.error = action.payload;
    },
    registerSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.isLoading = false;
    },
    registerFailure: (state, action) => {
      state.error = action.payload;
    },
    logoutSuccess: (state) => {
      state.currentUser = null;
    },
  },
});

export const {
  loginFailure,
  loginSuccess,
  registerFailure,
  registerSuccess,
  logoutSuccess,
} = authSlice.actions;

export default authSlice.reducer;

export const register = (user) => async (dispatch) => {
  try {
    const config = {
      headers: {
        'content-type': 'application/json',
      },
    };

    const response = await axios.post('http://localhost:4000/auth/register', user, config);

    if (response) {
      dispatch(registerSuccess(response.data));
      toast.success('Registration successful');
      history.push('/signin');
      window.location.reload();
    } else {
      dispatch(registerFailure());
      toast.error('Registration failed');
    }
  } catch (error) {
    console.error(error);
    dispatch(registerFailure());
  }
};

export const signin = (user) => async (dispatch) => {
  try {
    const userData = {
      email: user.email,
      password: user.password,
    };

    const response = await axios.post('http://localhost:4000/auth/signin', userData);

    if (response) {
      localStorage.setItem('auth', JSON.stringify(response.data));
      dispatch(loginSuccess(response.data));
      history.push('/dashboard');
      toast.success('Login successful');
      window.location.reload();
    } else {
      dispatch(loginFailure());
      toast.error('Login failed');
    }
  } catch (error) {
    dispatch(loginFailure());
    console.error(error);
  }
};
