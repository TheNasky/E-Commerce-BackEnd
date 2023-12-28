import CategoriesModel from "../schemas/categoriesSchema.js";
import { resFail, resSuccess } from "../config/utils/response.js";
import { logger } from "../config/logger.js";
import slugify from "slugify";

class CategoriesService {
   static async getCategories() {
      try {
         const categories = await CategoriesModel.find();
         return resSuccess(200, "Displaying all categories", { categories });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }

   static async getCategory(title) {
      try {
         const processedTitle = slugify(title.toLowerCase());
         const category = await CategoriesModel.findOne({ title: processedTitle });
         if (!category) {
            return resFail(404, `Category ${title} not found`);
         }
         return resSuccess(200, `Displaying category: ${title}`, { category });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }

   static async createCategory(title) {
      try {
         const processedTitle = slugify(title.toLowerCase());
         const category = await CategoriesModel.findOne({ title: processedTitle });
         if (category) {
            return resFail(409, `Category ${title} already exists`);
         }
         const newCategory = await CategoriesModel.create({ title });
         return resSuccess(201, "Category created successfully", { newCategory });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }

   static async deleteCategory(title) {
      try {
         const category = await CategoriesModel.findOneAndDelete({ title });
         if (!category) {
            return resFail(404, `Category ${title} not found`);
         }
         return resSuccess(200, `Category ${title} deleted successfully`);
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }

   static async updateCategory(oldTitle, newTitle) {
      try {
         const processedOldTitle = slugify(oldTitle.toLowerCase());
         const processedNewTitle = slugify(newTitle.toLowerCase());
         const category = await CategoriesModel.findOne({
            title: processedOldTitle,
         });
         if (!category) {
            return resFail(404, `Category ${oldTitle} not found`);
         }
         const existingCategory = await CategoriesModel.findOne({
            title: processedNewTitle,
         });
         if (existingCategory) {
            return resFail(409, `Category ${newTitle} already exists`);
         }
         category.title = newTitle;
         await category.save();
         return resSuccess(200, `Category ${oldTitle} updated to ${newTitle}`, {
            updatedCategory: category,
         });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
}

export default CategoriesService;
