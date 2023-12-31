const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());
const Todo = require("./models/ToDo");
const User = require("./models/User");

const port = 3001;
const secretKey = "yourSecretKey"; // Replace with a secure secret key

mongoose
  .connect("mongodb://localhost:27017/task-management-database", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((err) => {
    console.log(err);
  });

// User Registration
app.post("/api/users/register", async (req, res) => {
  console.log("Registration endpoint accessed");
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }

    user = new User({ email, password });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, secretKey, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// User Login
app.post("/api/users/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid Credentials" });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, secretKey, { expiresIn: 3600 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Protected Route - Example: Get user's tasks
app.get("/api/todos", authenticateUser, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// CRUD operations for tasks

// Get a single task by id
app.get("/api/todos/:id", authenticateUser, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id });
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Delete a task by id
app.delete("/api/todos/:id", authenticateUser, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id });
    await todo.remove();
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Modify a task by id
app.put("/api/todos/:id", authenticateUser, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id });
    todo.title = req.body.title;
    todo.description = req.body.description;
    todo.dueDate = req.body.dueDate;
    todo.priority = req.body.priority;
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// Create a new task
app.post("/api/todos", authenticateUser, async (req, res) => {
  try {
    const todo = new Todo({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      priority: req.body.priority,
      user: req.user.id,
    });
    await todo.save();
    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

function authenticateUser(req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
}
