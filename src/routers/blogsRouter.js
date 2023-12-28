import express from "express";
const blogsRouter = express.Router();
import { createBlog } from "../controllers/blogsController.js";
import { isAdmin, isLoggedIn } from "../middlewares/auth.js";
import {
   getBlogs,
   getBlog,
   updateBlog,
   deleteBlog,
   likeBlog,
   dislikeBlog,
   uploadImages,
   deleteImage,
   updateImages
} from "../controllers/blogsController.js";
import { multerUploadImage } from "../middlewares/uploadImages.js";

blogsRouter.post("/", isAdmin, createBlog);
blogsRouter.get("/", getBlogs);
blogsRouter.get("/:id", getBlog);
blogsRouter.put("/:id", isAdmin, updateBlog);
blogsRouter.delete("/:id", isAdmin, deleteBlog);
blogsRouter.put("/like/:id", isLoggedIn, likeBlog);
blogsRouter.put("/dislike/:id", isLoggedIn, dislikeBlog);
blogsRouter.put("/upload/:id", isAdmin, multerUploadImage, uploadImages);
blogsRouter.delete("/deleteImage/:id", isAdmin, deleteImage);
blogsRouter.put("/updateImages/:id", isAdmin, updateImages);
export default blogsRouter;
