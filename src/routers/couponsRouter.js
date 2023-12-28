import express from "express";
import { isAdmin } from "../middlewares/auth.js";
import {
   createCoupon,
   getCoupons,
   updateCoupon,
   renewCoupon,
   deleteCoupon,
} from "../controllers/couponsController.js";

const couponsRouter = express.Router();

couponsRouter.post("/", isAdmin, createCoupon);
couponsRouter.get("/", isAdmin, getCoupons);
couponsRouter.put("/:id", isAdmin, updateCoupon);
couponsRouter.post("/renew/:id", isAdmin, renewCoupon);
couponsRouter.delete("/:id", isAdmin, deleteCoupon);

export default couponsRouter;
