import express from "express";
import {
   createCategory,
   deleteCategory,
   updateCategory,
   getCategories,
   getCategory,
} from "../controllers/categoriesController.js";
import { isAdmin } from "../middlewares/auth.js";
const categoriesRouter = express.Router();

categoriesRouter.get("/", isAdmin, getCategories);
categoriesRouter.get("/:title", isAdmin, getCategory);
categoriesRouter.post("/", isAdmin, createCategory);
categoriesRouter.delete("/:title", isAdmin, deleteCategory);
categoriesRouter.put("/:oldTitle", isAdmin, updateCategory);

export default categoriesRouter;
