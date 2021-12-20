const express = require("express");
const AnimalSchema = require("../models/schema");
const db = require("../models/db");

const animals = db.get("animals");

const router = express.Router();

/* Get all animals */
router.get("/", async (req, res, next) => {
  try {
    const allAnimals = await animals.find({});
    res.json(allAnimals);
  } catch (error) {
    next(error);
  }
});

/* Get a specific animal */
router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const animal = await animals.findOne({
      _id: id,
    });

    if (!animal) {
      const error = new Error("animal does not exist");
      return next(error);
    }

    res.json(animal);
  } catch (error) {
    next(error);
  }
});

/* Create a new animal */
router.post("/add", async (req, res, next) => {
  try {
    const { title, description, image } = req.body;
    await AnimalSchema.validateAsync({ title, description, image });

    const animal = await animals.findOne({
      title,
    });

    // animal already exists
    if (animal) {
      const error = new Error("animal already exists");
      res.status(409); // conflict error
      return next(error);
    }

    const newAnimal = await animals.insert({
      title,
      description,
      image,
    });

    res.status(201).json(newAnimal);
  } catch (error) {
    next(error);
  }
});

/* Update a specific animal */
router.put("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, description, image } = req.body;
    const result = await AnimalSchema.validateAsync({ title, description, image });
    const animal = await animals.findOne({
      _id: id,
    });

    // animal does not exist
    if (!animal) {
      return next();
    }

    const updatedAnimal = await animals.update(
      {
        _id: id,
      },
      { $set: result },
      { upsert: true }
    );

    res.json(updatedAnimal);
  } catch (error) {
    next(error);
  }
});

/* Delete a specific animal */
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const animal = await animals.findOne({
      _id: id,
    });

    // animal does not exist
    if (!animal) {
      return next();
    }
    await animals.remove({
      _id: id,
    });

    res.json({
      message: "animal has been deleted",
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
