import express from "express";
const blogRouter = express.Router();
import { createBlog } from "../controllers/blogsController.js";
import { isAdmin } from "../middlewares/auth.js";
import {
   getBlogs,
   getBlog,
   updateBlog,
   deleteBlog,
   likeBlog,
   dislikeBlog,
} from "../controllers/blogsController.js";

blogRouter.post("/", isAdmin, createBlog);
blogRouter.get("/", getBlogs);
blogRouter.get("/:id", getBlog);
blogRouter.put("/:id", isAdmin, updateBlog);
blogRouter.delete("/:id", isAdmin, deleteBlog);
blogRouter.put("/like/:id", likeBlog);
blogRouter.put("/dislike/:id", dislikeBlog);

export default blogRouter;
