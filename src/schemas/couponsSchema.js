import mongoose from "mongoose";
import slugify from "slugify";

const schema = new mongoose.Schema(
   {
      code: {
         type: String,
         required: true,
         unique: true,
         uppercase: true,
      },
      expiry: {
         type: Date,
         required: true,
      },
      discount: {
         type: Number,
         required: true,
      },
   },
   {
      versionKey: false,
      timestamps: true,
   }
);

schema.pre("validate", function (next) {
   if (this.title) {
      this.title = slugify(this.title.toLowerCase());
   }
   next();
});

const CouponsModel = mongoose.model("coupons", schema);

export default CouponsModel;
