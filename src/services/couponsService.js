import mongoose from "mongoose";
import CouponsModel from "../schemas/couponsSchema.js";
import { resSuccess, resFail } from "../config/utils/response.js";
import { logger } from "../config/logger.js";

class CouponsService {
   static async createCoupon({ code, discount }) {
      try {
         if (!code || !discount) {
            return resFail(400, "Missing Code or Discount");
         }
         const existingCoupon = await CouponsModel.findOne({ code });
         if (existingCoupon) {
            return resFail(400, "Coupon already exists");
         }
         const coupon = new CouponsModel({
            code,
            discount,
            expiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000), // 15 days from now
         });
         await coupon.save();
         return resSuccess(201, "Coupon created successfully", { coupon });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async getCoupons() {
      try {
         const coupons = await CouponsModel.find();
         return resSuccess(200, "Coupons retrieved successfully", { coupons });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }

   static async updateCoupon(id, discount, expiry) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid coupon ID");
         }
         if (!expiry || !discount) {
            return resFail(400, "Missing Expiry or Discount");
         }
         const parsedExpiry = new Date(expiry);
         if (isNaN(parsedExpiry) || parsedExpiry < new Date()) {
            return resFail(400, "Invalid or past expiry date");
         }
         const coupon = await CouponsModel.findByIdAndUpdate(
            id,
            { discount, expiry },
            { new: true, runValidators: true }
         );
         if (!coupon) {
            return resFail(404, "Coupon not found");
         }
         return resSuccess(200, "Coupon updated successfully", { coupon });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async renewCoupon(id) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid coupon ID");
         }
         const coupon = await CouponsModel.findByIdAndUpdate(
            id,
            { expiry: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) },
            { new: true }
         );
         if (!coupon) {
            return resFail(404, "Coupon not found");
         }
         return resSuccess(200, "Coupon renewed successfully", { coupon });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async deleteCoupon(id) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid coupon ID");
         }
         const coupon = await CouponsModel.findByIdAndDelete(id);
         if (!coupon) {
            return resFail(404, "Coupon not found");
         }
         return resSuccess(200, "Coupon deleted successfully", { coupon });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
}

export default CouponsService;
