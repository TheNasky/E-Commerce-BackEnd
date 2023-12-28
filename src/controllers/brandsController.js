import BrandsService from "../services/brandsService.js";
import { response } from "../config/utils/response.js";

export const getBrands = async (req, res) => {
   const service = await BrandsService.getBrands();
   return response(res, service);
};

export const getBrand = async (req, res) => {
   const { title } = req.params;
   const service = await BrandsService.getBrand(title);
   return response(res, service);
};

export const createBrand = async (req, res) => {
   const { title } = req.body;
   const service = await BrandsService.createBrand(title);
   return response(res, service);
};

export const deleteBrand = async (req, res) => {
   const { title } = req.params;
   const service = await BrandsService.deleteBrand(title);
   return response(res, service);
};

export const updateBrand = async (req, res) => {
   const oldTitle = req.params.oldTitle;
   const { title } = req.body;
   const service = await BrandsService.updateBrand(oldTitle, title);
   return response(res, service);
};
