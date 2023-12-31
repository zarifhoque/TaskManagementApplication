/* eslint-disable react/prop-types */
import React from 'react';
import './listcard.scss';
import { BiChevronLeft, BiChevronRight, BiTrash } from 'react-icons/bi';
import { moveItemLeft, moveItemRight, deleteTask } from '../../redux/taskSlice';
import { useDispatch } from 'react-redux';

const TaskCard = ({ task }) => {
  const dispatch = useDispatch();

  const handleMoveLeft = () => {
    dispatch(moveItemLeft(task));
  };

  const handleMoveRight = () => {
    dispatch(moveItemRight(task));
  };

  const handleDelete = () => {
    dispatch(deleteTask(task._id));
  };

  return (
    <div>
      <ul className={`task-card ${task.status === 'done' ? 'completed' : ''}`}>
        <li>
          <p>{task._id}</p>
        </li>
        <li>
          <p>{task.task}</p>
        </li>
        <li>
          <p>{task.status}</p>
        </li>
        <li>
          <button disabled={task.status === 'backlog'} onClick={handleMoveLeft}>
            <BiChevronLeft />
          </button>
          <button disabled={task.status === 'done'} onClick={handleMoveRight}>
            <BiChevronRight />
          </button>
          <button onClick={handleDelete}>
            <BiTrash />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default TaskCard;
