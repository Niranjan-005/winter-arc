const express = require("express");
const Habit = require("../models/Habit");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

/* =========================================
   GET ALL HABITS
========================================= */

router.get("/", authMiddleware, async (req, res) => {
  try {
    const habits = await Habit.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.json(habits);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch habits",
    });
  }
});

/* =========================================
   CREATE HABIT
========================================= */

router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({
        message: "Habit name is required",
      });
    }

    const habit = await Habit.create({
      userId: req.user.userId,
      name: name.trim(),
    });

    res.status(201).json(habit);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create habit",
    });
  }
});

/* =========================================
   UPDATE HABIT
========================================= */

router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const { name, completedDates } = req.body;

    const habit = await Habit.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          message: "Habit name cannot be empty",
        });
      }

      habit.name = name.trim();
    }

    if (completedDates !== undefined) {
      habit.completedDates = completedDates;
    }

    await habit.save();

    res.json(habit);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update habit",
    });
  }
});

/* =========================================
   DELETE HABIT
========================================= */

router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const habit = await Habit.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!habit) {
      return res.status(404).json({
        message: "Habit not found",
      });
    }

    res.json({
      message: "Habit deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete habit",
    });
  }
});

module.exports = router;