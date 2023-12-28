import express from "express";
const authRouter = express.Router();
import {
   getSession,
   createUser,
   loginUser,
   logout,
   requestPasswordReset,
   verifyPasswordResetToken,
   resetPassword,
} from "../controllers/usersController.js";
import { isAdmin, isLoggedIn } from "../middlewares/auth.js";

authRouter.get("/session", isLoggedIn, getSession); // isAdmin,
authRouter.post("/register", createUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logout);
authRouter.post("/reset-password/request", requestPasswordReset);
authRouter.get("/reset-password/verify/:email/:resetToken", verifyPasswordResetToken);
authRouter.post("/reset-password/reset", resetPassword);

export default authRouter;
