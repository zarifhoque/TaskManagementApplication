import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import Sidebar from '../../components/sidebar/Sidebar';
import './dashboard.scss';
import { getAllTasks } from '../../redux/taskSlice';

const Dashboard = () => {
  const { task: taskList, auth: user } = useSelector((state) => state);
  const { AllTasks } = taskList;
  const { currentUser } = user;

  const pendingTask = AllTasks.filter((task) => task.status === 'todo');
  const completedTask = AllTasks.filter((task) => task.status === 'done');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllTasks(currentUser.token, currentUser.id));
  }, [dispatch, currentUser.token, currentUser.id]);

  return (
    <div>
      <div className='dashboard'>
        <div className='dashboard__left'>
          <Sidebar />
        </div>
        <div className='dashboard__right'>
          <div className='dashboard__rightContent'>
            <h2>Task Status Dashboard</h2>
            <div className='taskcount'>
              <div className='todo box'>Todo - {pendingTask.length}</div>
              <div className='done box'>Complete - {completedTask.length}</div>
            </div>
            <div className='createButton'>
              <Link to='/taskmanager' className='button'>
                Create Task
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
