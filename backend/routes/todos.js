const express = require("express");
const Todo = require("../models/Todo");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/* =========================================
   GET ALL TODOS
========================================= */

router.get("/", authMiddleware, async (req, res) => {
  try {
    const todos = await Todo.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(todos);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch tasks",
    });
  }
});

/* =========================================
   CREATE TODO
========================================= */

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Task name is required",
      });
    }

    const todo = await Todo.create({
      userId: req.user.userId,
      name: name.trim(),
    });

    res.status(201).json(todo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create task",
    });
  }
});

/* =========================================
   UPDATE TODO
========================================= */

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, completedDates } = req.body;

    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!todo) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Task name cannot be empty",
        });
      }

      todo.name = name.trim();
    }

    if (completedDates !== undefined) {
      todo.completedDates = completedDates;
    }

    await todo.save();

    res.json(todo);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update task",
    });
  }
});

/* =========================================
   DELETE TODO
========================================= */

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!todo) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    res.json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete task",
    });
  }
});

module.exports = router;