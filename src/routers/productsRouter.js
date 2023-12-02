import express from "express";
const productsRouter = express.Router();

import { isAdmin } from "../middlewares/auth.js";
import { getProducts, getProduct,createProduct } from "../controllers/productsController.js";

productsRouter.get("/", getProducts);
productsRouter.get("/:id", getProduct);
productsRouter.post("/", isAdmin, createProduct);
// productsRouter.delete("/:id", isAdmin, deleteProduct);
// productsRouter.put("/:id", isAdmin, updateProduct);

export default productsRouter;
