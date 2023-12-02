import mongoose from "mongoose";
import ProductsModel from "../schemas/productsSchema.js";
import { resSuccess, resFail } from "../config/utils/response.js";
import { logger } from "../config/logger.js";
class ProductsService {
   static async getProducts() {
      try {
         const products = await ProductsModel.find({});  
         return resSuccess(200, "Displaying all Products", { products });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async getProduct(id) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid user ID");
         }
         const product = await ProductsModel.findOne({ _id: id });
         if (!product) {
            return resFail(400, "Product Not Found");
         }
         return resSuccess(200, "Displaying product: " + id, { product });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async createProduct(body) {
      const { title, slug, description, price, category } = body;
      try {
         if (!title || !slug || !description || !price || !category) {
            return resFail(400, "Missing required parameters");
         }
         const product = await ProductsModel.create(body);
         return resSuccess(201, "Product Created", { product });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
}

export default ProductsService;
