const express = require("express");
const carTagsRouter = express.Router();
const { requireUser } = require("./utils");
const {
  addTagToCar,
  removeTagFromCar,
  getTagsByCar,
  getCarsByTag,
} = require("../db/car-tags");

carTagsRouter.use((req, res, next) => {
  console.log("a request is being made to /car-tags");

  next();
});

carTagsRouter.get("/", (req, res, next) => {
  res.send("hello world");
  next();
});

carTagsRouter.post("/add-tag/:tagId/:carId", async (req, res, next) => {
  try {
    const { tagId, carId } = req.params;

    const carTag = await addTagToCar(carId, tagId);
    res.send(carTag);
  } catch (error) {
    next(error);
  }
});

carTagsRouter.delete("/delete/:tagId/:carId", async (req, res, next) => {
  try {
    const { tagId, carId } = req.params;

    const deletedCar = await removeTagFromCar(tagId, carId);

    res.send(deletedCar);
  } catch (error) {
    next(error);
  }
});

carTagsRouter.get("/tags-by-car/:carId", async (req, res, next) => {
  try {
    const { carId } = req.params;

    const tags = await getTagsByCar(carId);

    res.send(tags);
  } catch (error) {
    next(error);
  }
});

carTagsRouter.get("/cars-by-tag/:tagId", async (req, res, next) => {
  try {
    const { tagId } = req.params;

    const cars = await getCarsByTag(tagId);

    res.send(cars);
  } catch (error) {
    next(error);
  }
});

module.exports = carTagsRouter;