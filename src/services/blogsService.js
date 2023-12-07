import BlogsModel from "../schemas/blogsSchema.js";
import { resFail, resSuccess } from "../config/utils/response.js";
import { logger } from "../config/logger.js";
import mongoose from "mongoose";

class BlogsService {
   static async createBlog(blogProperties) {
      const { title, description, category } = blogProperties;
      try {
         if (!title || !description || !category) {
            return resFail(400, "Missing required parameters");
         }
         const blog = await BlogsModel.create(blogProperties);
         return resSuccess(201, "Blog created successfully", { blog });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }

   static async getBlogs(queries) {
      try {
         const blogs = await BlogsModel.find({});
         return resSuccess(200, "Displaying Blogs", { blogs });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async getBlog(id) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid blog ID");
         }
         const blog = await BlogsModel.findOne({ _id: id });
         if (!blog) {
            return resFail(400, "Blog Not Found");
         }
         blog.numViews += 1;
         await blog.save();
         return resSuccess(200, "Displaying blog: " + id, { blog });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async updateBlog(id, updatedProperties) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid blog ID");
         }
         const blog = await BlogsModel.findOne({ _id: id });
         if (!blog) {
            return resFail(400, "Blog Not Found");
         }
         const propertiesToUpdate = Object.keys(updatedProperties).filter(
            (key) => key !== "_id" && blog[key] !== undefined
         );
         propertiesToUpdate.forEach((key) => {
            blog[key] = updatedProperties[key];
         });
         await blog.save({ new: true });
         return resSuccess(200, "Blog " + id + " Updated Successfully", {
            updatedBlog: blog,
         });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }

   static async deleteBlog(id) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid blog ID");
         }
         const blog = await BlogsModel.findOne({ _id: id });
         if (!blog) {
            return resFail(400, "Blog Not Found");
         }
         await BlogsModel.deleteOne({ _id: id });
         return resSuccess(200, "Blog " + id + " Deleted");
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async likeBlog(id, userId) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid blog ID");
         }
         const blog = await BlogsModel.findOne({ _id: id });
         if (!blog) {
            return resFail(400, "Blog Not Found");
         }
         if (!userId) {
            return resFail(401, "Unauthorized: User not logged in");
         }
         if (blog.likes.includes(userId)) {
            // User has already liked the blog, remove the like
            const index = blog.likes.indexOf(userId);
            blog.likes.splice(index, 1);
         } else {
            blog.likes.push(userId);
            // Remove the dislike if the user had disliked the blog before
            const dislikeIndex = blog.dislikes.indexOf(userId);
            if (dislikeIndex !== -1) {
               blog.dislikes.splice(dislikeIndex, 1);
            }
         }
         await blog.save({ new: true });
         return resSuccess(200, `Blog ${blog._id} liked`);
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async dislikeBlog(id, userId) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid blog ID");
         }
         const blog = await BlogsModel.findOne({ _id: id });
         if (!blog) {
            return resFail(400, "Blog Not Found");
         }
         if (!userId) {
            return resFail(401, "Unauthorized: User not logged in");
         }
         if (blog.dislikes.includes(userId)) {
            // User has already disliked the blog, remove the dislike
            const index = blog.dislikes.indexOf(userId);
            blog.dislikes.splice(index, 1);
         } else {
            blog.dislikes.push(userId);
            // Remove the like if the user had liked the blog before
            const likeIndex = blog.likes.indexOf(userId);
            if (likeIndex !== -1) {
               blog.likes.splice(likeIndex, 1);
            }
         }
         await blog.save({ new: true });
         return resSuccess(200, `Blog ${blog._id} disliked`);
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
}

export default BlogsService;
