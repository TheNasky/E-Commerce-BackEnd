import { response } from "../config/utils/response.js";
import BlogsService from "../services/blogsService.js";

export const createBlog = async (req, res) => {
   const blogProperties = req.body;
   const service = await BlogsService.createBlog(blogProperties);
   return response(res, service);
};

export const getBlogs = async (req, res) => {
   const queries = req.query;
   const service = await BlogsService.getBlogs(queries);
   return response(res, service);
};

export const getBlog = async (req, res) => {
   const { id } = req.params;
   const service = await BlogsService.getBlog(id);
   return response(res, service);
};

export const updateBlog = async (req, res) => {
   const { id } = req.params;
   const updatedProperties = req.body;
   const service = await BlogsService.updateBlog(id, updatedProperties);
   return response(res, service);
};

export const deleteBlog = async (req, res) => {
   const { id } = req.params;
   const service = await BlogsService.deleteBlog(id);
   return response(res, service);
};

export const likeBlog = async (req, res) => {
   const { id } = req.params;
   const userId = req.session?.user?._id;
   const service = await BlogsService.likeBlog(id, userId);
   return response(res, service);
};
export const dislikeBlog = async (req, res) => {
   const { id } = req.params;
   const userId = req.session?.user?._id;
   const service = await BlogsService.dislikeBlog(id, userId);
   return response(res, service);
};

export const uploadImages = async (req, res) => {
   const { id } = req.params;
   const files = req.files;
   const service = await BlogsService.uploadImage(id, files);
   return response(res, service);
};

export const deleteImage = async (req, res) => {
   const { id } = req.params;
   const { url } = req.body;
   const service = await BlogsService.deleteImage(id, url);
   return response(res, service);
};

export const updateImages = async (req, res) => {
   const { id } = req.params;
   const { images } = req.body;
   const service = await BlogsService.updateImages(id, images);
   return response(res, service);
};
