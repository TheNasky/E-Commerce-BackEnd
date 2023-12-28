import { response } from "../config/utils/response.js";
import CouponsService from "../services/couponsService.js";

export const createCoupon = async (req, res) => {
   const { code, discount } = req.body;
   const service = await CouponsService.createCoupon({ code, discount });
   return response(res, service);
};

export const getCoupons = async (req, res) => {
   const service = await CouponsService.getCoupons();
   return response(res, service);
};

export const updateCoupon = async (req, res) => {
   const { id } = req.params;
   const { discount, expiry } = req.body;
   const service = await CouponsService.updateCoupon(id, discount, expiry);
   return response(res, service);
};

export const renewCoupon = async (req, res) => {
   const { id } = req.params;
   const service = await CouponsService.renewCoupon(id);
   return response(res, service);
};

export const deleteCoupon = async (req, res) => {
   const { id } = req.params;
   const service = await CouponsService.deleteCoupon(id);
   return response(res, service);
};
