import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const initialTask = localStorage.getItem('task')
  ? JSON.parse(localStorage.getItem('task'))
  : null;

const initialState = {
  TaskData: initialTask,
  AllTasks: {},
};

export const taskSlice = createSlice({
  name: 'Task',
  initialState,
  reducers: {
    taskAddedSuccessfully: (state, action) => {
      state.TaskData = action.payload;
    },
    taskAddFailure: (state) => state,
    getAllTaskSuccess: (state, action) => {
      state.AllTasks = action.payload;
    },
    getAllTaskFailure: (state) => state,
    editTaskSuccess: (state, action) => {
      state.TaskData = action.payload;
    },
    deleteSuccess: (state, action) => {
      state.TaskData = action.payload;
    },
    deletefail: (state) => state,
  },
});

export const {
  taskAddFailure,
  taskAddedSuccessfully,
  getAllTaskFailure,
  getAllTaskSuccess,
  deleteSuccess,
  deletefail,
  editTaskSuccess,
} = taskSlice.actions;

export default taskSlice.reducer;

export const addTask = (task, id) => async (dispatch) => {
  const taskData = {
    task,
    id,
  };
  try {
    const response = await axios.post('http://localhost:4000/task/add', taskData);

    if (response) {
      localStorage.setItem('task', JSON.stringify(response.data));
      dispatch(taskAddedSuccessfully(response.data));
      toast.success('Task added successfully');
      window.location.reload();
    } else {
      dispatch(taskAddFailure());
    }
  } catch (error) {
    console.error(error);
    dispatch(taskAddFailure());
  }
};

export const getAllTasks = (token, id) => async (dispatch) => {
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      id,
    },
  };

  try {
    const response = await axios.get('http://localhost:4000/task/tasks', config);

    if (response) {
      dispatch(getAllTaskSuccess(response.data));
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      dispatch(getAllTaskFailure());
    }
  }
};

export const arrowClick = (item, string) => async () => {
  const taskData = {
    id: item._id,
    status: item.status,
    string,
  };

  try {
    const response = await axios.put(`http://localhost:4000/task/${taskData.id}`, taskData);

    if (response) {
      window.location.reload();
    }
  } catch (error) {
    console.error(error);
  }
};

export const deleteItem = (id) => async (dispatch) => {
  try {
    const response = await axios.delete(`http://localhost:4000/task/${id}`);

    if (response) {
      dispatch(deleteSuccess());
      toast.success('Task deleted successfully');
      window.location.reload();
    } else {
      dispatch(deletefail());
    }
  } catch (error) {
    console.error(error);
    dispatch(deletefail());
  }
};
