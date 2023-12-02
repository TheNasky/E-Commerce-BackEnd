import express from "express";
const authRouter = express.Router();
import { getSession, createUser, loginUser, logout } from "../controllers/usersController.js";
import { isAdmin } from "../middlewares/auth.js";

authRouter.get("/session", isAdmin, getSession);
authRouter.post("/register", createUser);
authRouter.post("/login", loginUser);
authRouter.post("/logout", logout);

export default authRouter;