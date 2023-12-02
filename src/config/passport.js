// passport.config.js
import passport from "passport";
import UsersModel from "../schemas/usersSchema.js";
import { v4 as uuidv4 } from "uuid";
import { hash, verify } from "argon2";

const initalizePassport = () => {
   passport.serializeUser((user, done) => {
      done(null, user._id);
   });

   passport.deserializeUser(async (id, done) => {
      let user = await UsersModel.findById(id);
      done(null, user);
   });
};

export default initalizePassport;
