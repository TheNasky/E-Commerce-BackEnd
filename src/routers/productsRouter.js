import express from "express";
const productsRouter = express.Router();

import { isAdmin } from "../middlewares/auth.js";
import {
   getProducts,
   getProduct,
   createProduct,
   updateProduct,
   deleteProduct,
} from "../controllers/productsController.js";

productsRouter.get("/", getProducts);
productsRouter.get("/:id", getProduct);
productsRouter.post("/", isAdmin, createProduct);
productsRouter.put("/:id", isAdmin, updateProduct);
productsRouter.delete("/:id", isAdmin, deleteProduct); 

export default productsRouter;
