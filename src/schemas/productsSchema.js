import mongoose from "mongoose";
import slugify from "slugify";

const schema = new mongoose.Schema(
   {
      title: {
         type: String,
         required: true,
         trim: true,
         max: 250,
      },
      slug: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
      },
      description: {
         type: String,
         required: true,
         max: 4000,
      },
      price: {
         type: Number,
         required: true,
      },
      category: {
         type: String,
         required: true,
      },
      brand: {
         type: String,
         enum: ["Apple", "Samsung", "Lenovo"],
      },
      stock: {
         type: Number,
         default: 0,
         required: true,
      },
      sold: {
         type: Number,
         default: 0,
      },
      images: {
         type: Array,
      },
      color: {
         type: String,
         enum: ["black", "brown", "red"],
      },
      ratings: [
         { star: Number, postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" } },
      ],
   },
   {
      timestamps: true,
      versionKey: false,
   }
);

schema.pre("validate", function (next) {
   if (this.category) {
      this.category = this.category.toLowerCase();
   }
   this.slug = slugify(this.title);

   next();
});

const ProductsModel = mongoose.model("products", schema);

export default ProductsModel;
