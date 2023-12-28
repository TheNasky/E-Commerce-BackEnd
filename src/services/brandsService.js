import BrandsModel from "../schemas/brandsSchema.js";
import { resFail, resSuccess } from "../config/utils/response.js";
import { logger } from "../config/logger.js";
import slugify from "slugify";

class BrandsService {
   static async getBrands() {
      try {
         const brands = await BrandsModel.find();
         return resSuccess(200, "Displaying all Brands", { brands });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }

   static async getBrand(title) {
      try {
         const processedTitle = slugify(title.toLowerCase());
         const brand = await BrandsModel.findOne({ title: processedTitle });
         if (!brand) {
            return resFail(404, `Brand ${title} not found`);
         }
         return resSuccess(200, `Displaying Brand: ${title}`, { brand });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }

   static async createBrand(title) {
      try {
         const processedTitle = slugify(title.toLowerCase());
         const brand = await BrandsModel.findOne({ title: processedTitle });
         if (brand) {
            return resFail(409, `Brand ${title} already exists`);
         }
         const newBrand = await BrandsModel.create({ title });
         return resSuccess(201, "Brand created successfully", { newBrand });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }

   static async deleteBrand(title) {
      try {
         const brand = await BrandsModel.findOneAndDelete({ title });
         if (!brand) {
            return resFail(404, `Brand ${title} not found`);
         }
         return resSuccess(200, `Brand ${title} deleted successfully`);
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }

   static async updateBrand(oldTitle, newTitle) {
      try {
         const processedOldTitle = slugify(oldTitle.toLowerCase());
         const processedNewTitle = slugify(newTitle.toLowerCase());
         const brand = await BrandsModel.findOne({ title: processedOldTitle });
         if (!brand) {
            return resFail(404, `Brand ${oldTitle} not found`);
         }
         const existingBrand = await BrandsModel.findOne({
            title: processedNewTitle,
         });
         if (existingBrand) {
            return resFail(409, `Brand ${newTitle} already exists`);
         }
         brand.title = newTitle;
         await brand.save();
         return resSuccess(200, `Brand ${oldTitle} updated to ${newTitle}`, {
            updatedBrand: brand,
         });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
}

export default BrandsService;
