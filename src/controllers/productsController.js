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
