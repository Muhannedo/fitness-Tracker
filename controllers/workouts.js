const express = require("express");
const verifyToken = require("../middleware/verify-token");
const Workout = require("../models/workout");
const router = express.Router();

// Public Routes

// Protected Routes
router.use(verifyToken);
// CREATE WORKOUT
router.post("/", async (req, res) => {
  try {
    const workout = new Workout(req.body);
    workout.user = req.user._id;
    await workout.save();
    res.status(201).send(workout);
  } catch (error) {
    res.status(400).send(error);
  }
});

// GET ALL WORKOUTS
router.get("/", async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user._id });
    res.send(workouts);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET WORKOUT BY ID
router.get("/:id", async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!workout) {
      return res.status(404).send({ message: "Workout not found" });
    }
    res.send(workout);
  } catch (error) {
    res.status(500).send(error);
  }
});

// UPDATE WORKOUT
router.put("/:id", async (req, res) => {
  try {
    const workout = await Workout.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!workout) {
      return res.status(404).send({ message: "Workout not found" });
    }
    Object.keys(req.body).forEach((key) => {
      workout[key] = req.body[key];
    });
    await workout.save();
    res.send(workout);
  } catch (error) {
    res.status(400).send(error);
  }
});

// DELETE WORKOUT
router.delete("/:id", async (req, res) => {
  try {
    const workout = await Workout.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!workout) {
      return res.status(404).send({ message: "Workout not found" });
    }
    res.send(workout);
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
