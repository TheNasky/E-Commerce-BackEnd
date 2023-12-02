import { response } from "../config/utils/response.js";
import ProductsService from "../services/productsService.js";

export const getProducts = async (req, res) => {
   const service = await ProductsService.getProducts();
   return response(res, service);
};
export const getProduct = async (req, res) => {
   const { id } = req.params;
   const service = await ProductsService.getProduct(id);
   return response(res, service);
};
export const createProduct = async (req, res) => {
   const body = req.body
   const service = await ProductsService.createProduct(body);
   return response(res, service);
};