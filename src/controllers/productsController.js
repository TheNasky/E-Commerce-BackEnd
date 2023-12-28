import { response } from "../config/utils/response.js";
import ProductsService from "../services/productsService.js";

export const getProducts = async (req, res) => {
   const queries = req.query;
   const service = await ProductsService.getProducts(queries);
   return response(res, service);
};
export const getProduct = async (req, res) => {
   const { id } = req.params;
   const service = await ProductsService.getProduct(id);
   return response(res, service);
};
export const createProduct = async (req, res) => {
   const productProperties = req.body;
   const service = await ProductsService.createProduct(productProperties);
   return response(res, service);
};

export const updateProduct = async (req, res) => {
   const { id } = req.params;
   const updatedProperties = req.body;
   const service = await ProductsService.updateProduct(id, updatedProperties);
   return response(res, service);
};

export const deleteProduct = async (req, res) => {
   const { id } = req.params;
   const service = await ProductsService.deleteProduct(id);
   return response(res, service);
};

export const addToWishlist = async (req, res) => {
   const { id } = req.params;
   const userId = req.session?.user?._id;
   const service = await ProductsService.addToWishList(id, userId);
   if (service.payload.user) {
      req.session.user.wishlist = service.payload.user.wishlist;
   }
   const { payload, ...strippedService } = service;
   return response(res, strippedService);
};

export const removeFromWishlist = async (req, res) => {
   const { id } = req.params;
   const userId = req.session?.user?._id;
   const service = await ProductsService.removeFromWishList(id, userId);
   if (service.payload.user) {
      req.session.user.wishlist = service.payload.user.wishlist;
   }
   const { payload, ...strippedService } = service;
   return response(res, strippedService);
};

export const rateProduct = async (req, res) => {
   const userId = req.session?.user?._id;
   const prodId = req.params.id;
   const { rating, comment } = req.body;
   const service = await ProductsService.rateProduct(userId, rating, comment, prodId);
   return response(res, service);
};

export const getReviews = async (req, res) => {
   const { id } = req.params;
   const service = await ProductsService.getReviews(id);
   return response(res, service);
};

export const uploadImages = async (req, res) => {
   const { id } = req.params;
   const files = req.files;
   const service = await ProductsService.uploadImage(id, files);
   return response(res, service);
};

export const deleteImage = async (req, res) => {
   const { id } = req.params;
   const { url } = req.body;
   const service = await ProductsService.deleteImage(id, url);
   return response(res, service);
};

export const updateImages = async (req, res) => {
   const { id } = req.params;
   const { images } = req.body;
   const service = await ProductsService.updateImages(id, images);
   return response(res, service);
};
