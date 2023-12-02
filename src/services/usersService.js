import mongoose from "mongoose";
import { hash, verify } from "argon2";
import UsersModel from "../schemas/usersSchema.js";
import { resSuccess, resFail } from "../config/utils/response.js";
import { logger } from "../config/logger.js"

class UsersService {
   static async createUser(firstName, lastName, email, password) {
      if (!firstName || !lastName || !email || !password) {
         return resFail(400, "All fields are required");
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
         return resFail(400, "Invalid email address");
      }
      const finduser = await UsersModel.findOne({ email: email });
      if (finduser) {
         return resFail(400, "Email already in use");
      }
      if (password.length < 8) {
         return resFail(400, "Password must be at least 8 characters long");
      }
      const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      if (!passwordRegex.test(password)) {
         return resFail(400, "Password must contain at least one letter and one number");
      }

      try {
         const newUser = new UsersModel({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: await hash(password),
         });
         await newUser.save();
         const userCreated = await UsersModel.findOne({ email: email });
         return resSuccess(201, "User created successfully", { userCreated });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async loginUser(email, password) {
      try {
         const user = await UsersModel.findOne({ email: email });
         if (!user) {
            return resFail(400, "User or Password do not match");
         }
         if (!verify(user.password, password)) {
            return resFail(400, "User or Password do not match");
         }
         return resSuccess(200, "Logged in", { user });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }

   static async getUsers() {
      try {
         const users = await UsersModel.find({});
         return resSuccess(200, "Displaying all Users", { users });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async getUser(id) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid user ID");
         }
         const user = await UsersModel.findOne({ _id: id });
         if (!user) {
            return resFail(400, "User Not Found");
         }
         return resSuccess(200, "Displaying User: " + id, { user });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async deleteUser(id) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid user ID");
         }
         const user = await UsersModel.findOne({ _id: id });
         if (!user) {
            return resFail(400, "User Not Found");
         }
         await UsersModel.deleteOne({ _id: id });
         return resSuccess(200, "User " + id + " Deleted");
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async updateUser(id, updatedProperties) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid user ID");
         }
         const user = await UsersModel.findOne({ _id: id });
         if (!user) {
            return resFail(400, "User Not Found");
         }
         if ("password" in updatedProperties) {
            return resFail(400, "Password cannot be updated");
         }
         const propertiesToUpdate = Object.keys(updatedProperties).filter(
            (key) => key !== "_id" && key !== "password" && user[key] !== undefined
         );
         propertiesToUpdate.forEach((key) => {
            user[key] = updatedProperties[key];
         });
         await user.save({ new: true });

         return resSuccess(200, "User " + id + " Updated Successfully", { updatedUser: user });
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async blockUser(id) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid user ID");
         }
         const user = await UsersModel.findOne({ _id: id });
         if (!user) {
            return resFail(400, "User Not Found");
         }
         await UsersModel.findByIdAndUpdate(id, { isBlocked: true }, { new: true });
         return resSuccess(200, "User " + id + " Blocked");
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
   static async unblockUser(id) {
      try {
         if (!mongoose.Types.ObjectId.isValid(id)) {
            return resFail(400, "Invalid user ID");
         }
         const user = await UsersModel.findOne({ _id: id });
         if (!user) {
            return resFail(400, "User Not Found");
         }
         await UsersModel.findByIdAndUpdate(id, { isBlocked: false }, { new: true });
         return resSuccess(200, "User " + id + " unBlocked");
      } catch (error) {
         logger.error(`${error.stack}`);
         return resFail(500, "Internal Server Error");
      }
   }
}

export default UsersService;
