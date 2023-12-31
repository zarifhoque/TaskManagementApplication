import React, { useState } from 'react';
import './addtask.scss';
import { useDispatch, useSelector } from 'react-redux';
import { addTask } from '../../redux/taskSlice';

const AddTask = () => {
  const dispatch = useDispatch();
  const { auth } = useSelector((state) => ({ ...state }));
  const { currentUser } = auth;

  const [state, setState] = useState({
    task: '',
  });

  const handleChange = (e) => {
    setState({
      ...state,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTask(state.task, currentUser.id));
    setState({
      task: '',
    });
  };

  return (
    <div className='add-task'>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          name='task'
          placeholder='Add your task'
          onChange={handleChange}
          value={state.task}
        />
        <button className='button'>Add Task</button>
      </form>
    </div>
  );
};

export default AddTask;
