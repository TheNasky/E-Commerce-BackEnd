import express from "express";
const productsRouter = express.Router();

import { isAdmin, isLoggedIn } from "../middlewares/auth.js";
import { multerUploadImage } from "../middlewares/uploadImages.js";
import {
   getProducts,
   getProduct,
   createProduct,
   updateProduct,
   deleteProduct,
   addToWishlist,
   removeFromWishlist,
   rateProduct,
   getReviews,
   uploadImages,
   deleteImage,
   updateImages,
} from "../controllers/productsController.js";

productsRouter.get("/", getProducts);
productsRouter.get("/:id", getProduct);
productsRouter.post("/", isAdmin, createProduct);
productsRouter.put("/:id", isAdmin, updateProduct);
productsRouter.delete("/:id", isAdmin, deleteProduct);
productsRouter.post("/addToWishlist/:id", isLoggedIn, addToWishlist);
productsRouter.post("/removeFromWishlist/:id", isLoggedIn, removeFromWishlist);
productsRouter.post("/rate/:id", isLoggedIn, rateProduct);
productsRouter.get("/reviews/:id", getReviews);
productsRouter.put("/upload/:id", isAdmin, multerUploadImage, uploadImages);
productsRouter.delete("/deleteImage/:id", isAdmin, deleteImage);
productsRouter.put("/updateImages/:id", isAdmin, updateImages);
export default productsRouter;
