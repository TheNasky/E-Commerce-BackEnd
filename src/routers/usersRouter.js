import express from "express";
const usersRouter = express.Router();
import { isAdmin } from "../middlewares/auth.js";
import {
   getUsers,
   getUser,
   deleteUser,
   updateUser,
   blockUser,
   unblockUser,
} from "../controllers/usersController.js";

usersRouter.get("/", isAdmin, getUsers);
usersRouter.get("/:id", isAdmin, getUser);
usersRouter.delete("/:id", isAdmin, deleteUser);
usersRouter.put("/:id", isAdmin, updateUser);
usersRouter.post("/block/:id", isAdmin, blockUser);
usersRouter.post("/unblock/:id", isAdmin, unblockUser);

export default usersRouter;
