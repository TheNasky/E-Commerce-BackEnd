import mongoose from "mongoose";
import ProductsModel from "../schemas/productsSchema.js";
import { resSuccess, resFail } from "../config/utils/response.js";
import { logger } from "../config/logger.js";
import slugify from "slugify";

class ProductsService {
   static async getProducts(queries) {
      try {
         let filter = {};
         // Handle price range queries
         if (queries.minPrice || queries.maxPrice) {
            filter.price = {};
            if (queries.minPrice) {
               filter.price.$gte = queries.minPrice;
            }
            if (queries.maxPrice) {
               filter.price.$lte = queries.maxPrice;
            }
         }
         // Handle sorting queries
         let sortOptions = {};
         if (queries.sort) {
            const sortOrder = queries.sort.toLowerCase() === "desc" ? -1 : 1;
            sortOptions = { price: sortOrder };
         }
         // Handle pagination queries
         const limit = parseInt(queries.limit) || 25; 
         const page = parseInt(queries.page) || 1; 
         const skip = (page - 1) * limit;

         // Fetch products with pagination and sorting
         const products = await ProductsModel.find(filter)
            .sort(sortOptions)
            .limit(limit)
            .skip(skip);
         // Calculate total pages   
         const totalCount = await ProductsModel.countDocuments(filter);
         const totalPages = Math.ceil(totalCount / limit);
         if(page > totalPages){
            return resFail(400, "Page Not Found",);
         }
         return resSuccess(200, "Displaying Products", { products, totalPages });
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
   static async createProduct(productProperties) {
      const { title, description, price, category } = productProperties;
      try {
         if (!title || !description || !price || !category) {
            return resFail(400, "Missing required parameters");
         }
         const product = await ProductsModel.create(productProperties);
         return resSuccess(201, "Product Created", { product });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async updateProduct(id, updatedProperties) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid product ID");
         }
         const product = await ProductsModel.findOne({ _id: id });
         if (!product) {
            return resFail(400, "Product Not Found");
         }
         const propertiesToUpdate = Object.keys(updatedProperties).filter(
            (key) => key !== "_id" && product[key] !== undefined
         );
         propertiesToUpdate.forEach((key) => {
            product[key] = updatedProperties[key];
         });
         await product.save({ new: true });
         return resSuccess(200, "Product " + id + " Updated Successfully", {
            updatedProduct: product,
         });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async deleteProduct(id) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid product ID");
         }
         const product = await ProductsModel.findOne({ _id: id });
         if (!product) {
            return resFail(400, "Product Not Found");
         }
         await ProductsModel.deleteOne({ _id: id });
         return resSuccess(200, "Product " + id + " Deleted");
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
}

export default ProductsService;
