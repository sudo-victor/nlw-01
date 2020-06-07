import express from "express";
import { celebrate, Joi } from "celebrate";
import validateConfig from "./config/validate";
import multer from "multer";
import multerConfig from "./config/multer";

// Schemas
import PointSchema from "./schemas/pointSchema";

// Controllers
import PointsController from "./controllers/PointsController";
import ItemsController from "./controllers/ItemsController";

// Instances
const pointsController = new PointsController();
const itemsController = new ItemsController();
const routes = express.Router();
const upload = multer(multerConfig);

// Routes
routes.get("/items", itemsController.index);

routes.post(
    "/points",
    upload.single("image"),
    celebrate(PointSchema.post, validateConfig),
    pointsController.create
);
routes.get("/points", pointsController.index);
routes.get("/points/:id", pointsController.show);

export default routes;
