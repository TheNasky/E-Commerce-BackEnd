import CategoriesService from "../services/categoriesService.js";
import { response } from "../config/utils/response.js";

export const getCategories = async (req, res) => {
   const service = await CategoriesService.getCategories();
   return response(res, service);
};

export const getCategory = async (req, res) => {
   const { title } = req.params;
   const service = await CategoriesService.getCategory(title);
   return response(res, service);
};

export const createCategory = async (req, res) => {
   const { title } = req.body;
   const service = await CategoriesService.createCategory(title);
   return response(res, service);
};

export const deleteCategory = async (req, res) => {
   const { title } = req.params;
   const service = await CategoriesService.deleteCategory(title);
   return response(res, service);
};

export const updateCategory = async (req, res) => {
   const oldTitle = req.params.oldTitle;
   const { title } = req.body;
   const service = await CategoriesService.updateCategory(oldTitle, title);
   return response(res, service);
};
