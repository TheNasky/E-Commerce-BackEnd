import mongoose from "mongoose";

const schema = new mongoose.Schema(
   {
      firstName: { type: String, required: true, max: 150 },
      lastName: { type: String, required: true, max: 150 },
      email: { type: String, required: true, max: 150, unique: true },
      password: { type: String, required: true, max: 50 },
      address: { type: mongoose.Schema.Types.ObjectId, ref: "Addresses" },
      cart: { type: mongoose.Schema.Types.ObjectId, ref: "carts" },
      wishlist: [
         {
            product: {
               type: mongoose.Schema.Types.ObjectId,
               ref: "products",
               required: true,
            },
            _id: false,
         },
      ],
      roles: { type: [String], required: true, default: ["User"] },
      isBlocked: { type: Boolean, required: true, default: false },
      lastLogin: { type: Date, default: null },
      loginType: { type: String, default: "Normal" },
      isVerified: { type: Boolean, default: false, required: true },
      vfToken: { type: String, default: 0 },
      pwResetToken: { type: String, default: null },
      pwResetTokenExpire: { type: Date, default: null },
   },
   {
      timestamps: true,
      versionKey: false,
   }
);

const UsersModel = mongoose.model("users", schema);

export default UsersModel;
