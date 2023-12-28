import mongoose, { trusted } from "mongoose";
import ProductsModel from "../schemas/productsSchema.js";
import UsersModel from "../schemas/usersSchema.js";
import { resSuccess, resFail } from "../config/utils/response.js";
import { logger } from "../config/logger.js";
import storage from "../config/firebaseConfig.js";
import fs from "fs";
import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

class ProductsService {
   static async getProducts(queries) {
      try {
         let filter = {};
         Object.keys(queries).forEach((key) => {
            if (!["minPrice", "maxPrice", "sort", "limit", "page", "skip"].includes(key)) {
               // Exclude special keywords and handle other properties dynamically
               filter[key] = queries[key];
            }
         });
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
         if (totalCount == 0) {
            return resFail(400, "No products found with specified filters");
         }
         if (page > totalPages) {
            return resFail(400, "Page Not Found");
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
         const product = await ProductsModel.findOne({ _id: id }).populate();
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
         const product = await ProductsModel.findOne({ title: title });
         if (product) {
            return resFail(400, "Product already exists");
         }
         const createdProduct = await ProductsModel.create(productProperties);
         return resSuccess(201, "Product Created", { createdProduct });
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
         return resSuccess(200, "Product " + id + " Updated Successfully", { product });
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
   static async addToWishList(productId, userId) {
      try {
         if (!mongoose.Types.ObjectId.isValid(productId)) {
            return resFail(400, "Invalid product ID");
         }
         const product = await ProductsModel.findById(productId);
         if (!product) {
            return resFail(404, "Product not found");
         }
         const user = await UsersModel.findById(userId);
         if (!user) {
            return resFail(404, "User not found");
         }
         const alreadyInWishList = user.wishlist.find(
            (item) => item.product.toString() === productId
         );
         if (alreadyInWishList) {
            return resFail(400, "Product already in wishlist");
         }
         user.wishlist.push({ product: productId });
         await user.save({ new: true });
         return resSuccess(200, "Product " + productId + " added to wishlist successfully", {
            user,
         });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async removeFromWishList(productId, userId) {
      try {
         if (!mongoose.Types.ObjectId.isValid(productId)) {
            return resFail(400, "Invalid product ID");
         }
         const product = await ProductsModel.findById(productId);
         if (!product) {
            return resFail(404, "Product not found");
         }
         const user = await UsersModel.findById(userId);
         if (!user) {
            return resFail(404, "User not found");
         }
         const inWishlistIndex = user.wishlist.findIndex(
            (item) => item.product.toString() === productId
         );
         if (inWishlistIndex === -1) {
            return resFail(400, "Product not found in wishlist");
         }
         user.wishlist.splice(inWishlistIndex, 1);
         await user.save({ new: true });
         return resSuccess(
            200,
            "Product " + productId + " removed from wishlist successfully",
            { user }
         );
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async rateProduct(userId, rating, comment, prodId) {
      try {
         if (
            !mongoose.Types.ObjectId.isValid(userId) ||
            !mongoose.Types.ObjectId.isValid(prodId)
         ) {
            return resFail(400, "Invalid user or product ID");
         }
         if (!rating || rating < 1 || rating > 5) {
            return resFail(400, "Invalid Rating");
         }
         const user = await UsersModel.findById(userId);
         if (!user) {
            return resFail(404, "User not found");
         }
         const product = await ProductsModel.findById(prodId);
         if (!product) {
            return resFail(404, "Product not found");
         }
         const existingRating = product.reviews.find((r) => r.postedBy.toString() === userId);
         if (existingRating) {
            return resFail(400, "You have already rated this product");
         }
         product.reviews.push({
            rating: rating,
            comment: comment,
            postedBy: userId,
         });
         await product.save();
         const averageRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
         product.averagerating = parseFloat(
            (averageRating / product.reviews.length).toFixed(1)
         );
         product.numberofratings = product.reviews.length;
         await product.save();
         return resSuccess(200, "Product rated successfully", { product });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async getReviews(prodId) {
      try {
         if (!mongoose.Types.ObjectId.isValid(prodId)) {
            return resFail(400, "Invalid product ID");
         }
         const product = await ProductsModel.findById(prodId);
         if (!product) {
            return resFail(404, "Product not found");
         }
         const ratings = product.reviews.map((review) => ({
            rating: review.rating,
            comment: review.comment,
            postedBy: review.postedBy,
         }));
         return resSuccess(200, "Reviews retrieved successfully", { ratings });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async uploadImage(prodId, files) {
      try {
         if (!mongoose.Types.ObjectId.isValid(prodId)) {
            return resFail(400, "Invalid product ID");
         }
         if (!files || files.length <= 0) {
            return resFail(400, "Please upload at least one image");
         }
         const product = await ProductsModel.findById(prodId);
         if (!product) {
            return resFail(404, "Product not found");
         }
         const bucket = storage.bucket();
         for (const file of files) {
            const uniquesuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
            const destination = `products/${encodeURIComponent(
               file.fieldname
            )}-${uniquesuffix}.jpeg`;
            const fileRef = bucket.file(destination);
            const buffer = await fs.promises.readFile(file.path);
            // Resize the image using sharp
            const resizedBuffer = await sharp(buffer)
               .resize({ width: 400, height: 300, fit: "inside" })
               .toFormat("jpeg")
               .jpeg({ quality: 90 })
               .toBuffer();
            // Upload the resized buffer to Firebase Storage
            await fileRef.createWriteStream().end(resizedBuffer);
            const url = `https://firebasestorage.googleapis.com/v0/b/next-ecommerce-403923.appspot.com/o/${encodeURIComponent(
               destination
            )}?alt=media`;
            product.images.push({ url });
            await product.save({ new: true });
            const localFilePath = join(__dirname, `../public/images/${file.filename}`);
            await fs.promises.unlink(localFilePath);
         }

         return resSuccess(200, "Image uploaded to product " + prodId, { product });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async deleteImage(prodId, url) {
      try {
         if (!mongoose.Types.ObjectId.isValid(prodId)) {
            return resFail(400, "Invalid product ID");
         }
         const product = await ProductsModel.findById(prodId);
         if (!product) {
            return resFail(404, "Product not found");
         }
         const imageIndex = product.images.findIndex((img) => img.url === url);
         if (imageIndex === -1) {
            return resFail(400, "Image not found in the product");
         }
         product.images.splice(imageIndex, 1);
         await product.save({ new: true });
         return resSuccess(200, "Image deleted from product " + prodId, { product });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async updateImages(prodId, imageUrls) {
      try {
         if (!mongoose.Types.ObjectId.isValid(prodId)) {
            return resFail(400, "Invalid product ID");
         }
         const product = await ProductsModel.findById(prodId);
         if (!product) {
            return resFail(404, "Product not found");
         }
         product.images = imageUrls.map((url) => ({ url }));
         await product.save({ new: true });
         return resSuccess(200, "Images updated successfully", { product });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
}

export default ProductsService;
