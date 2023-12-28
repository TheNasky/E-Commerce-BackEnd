import express from "express";
import {
   createBrand,
   deleteBrand,
   updateBrand,
   getBrands,
   getBrand,
} from "../controllers/brandsController.js";
import { isAdmin } from "../middlewares/auth.js";
const brandsRouter = express.Router();

brandsRouter.get("/", isAdmin, getBrands);
brandsRouter.get("/:title", isAdmin, getBrand);
brandsRouter.post("/", isAdmin, createBrand);
brandsRouter.delete("/:title", isAdmin, deleteBrand);
brandsRouter.put("/:oldTitle", isAdmin, updateBrand);

export default brandsRouter;
