const TaskModel = require("../models/TaskModel");
const { isValidObjectId } = require("../utilities/validationUtility");

// Function to get all tasks for the authenticated user
exports.fetchTasks = async (req, res) => {
  try {
    const tasks = await TaskModel.find({ user: req.user.id });
    res.status(200).json({ tasks, success: true, message: "Tasks retrieved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Function to get a specific task for the authenticated user
exports.fetchTask = async (req, res) => {
  try {
    // Validate the task ID
    if (!isValidObjectId(req.params.taskId)) {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }

    const task = await TaskModel.findOne({ user: req.user.id, _id: req.params.taskId });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    res.status(200).json({ task, success: true, message: "Task retrieved successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Function to create a new task for the authenticated user
exports.createTask = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, message: "Task description not provided" });
    }

    const task = await TaskModel.create({ user: req.user.id, description });
    res.status(201).json({ task, success: true, message: "Task created successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Function to update an existing task for the authenticated user
exports.updateTask = async (req, res) => {
  try {
    const { description } = req.body;
    if (!description) {
      return res.status(400).json({ success: false, message: "Task description not provided" });
    }

    // Validate the task ID
    if (!isValidObjectId(req.params.taskId)) {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }

    let task = await TaskModel.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Check if the task belongs to the authenticated user
    if (task.user != req.user.id) {
      return res.status(403).json({ success: false, message: "You can't update another user's task" });
    }

    task = await TaskModel.findByIdAndUpdate(req.params.taskId, { description }, { new: true });
    res.status(200).json({ task, success: true, message: "Task updated successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// Function to delete a task for the authenticated user
exports.removeTask = async (req, res) => {
  try {
    // Validate the task ID
    if (!isValidObjectId(req.params.taskId)) {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }

    let task = await TaskModel.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Check if the task belongs to the authenticated user
    if (task.user != req.user.id) {
      return res.status(403).json({ success: false, message: "You can't delete another user's task" });
    }

    await TaskModel.findByIdAndDelete(req.params.taskId);
    res.status(200).json({ success: true, message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
