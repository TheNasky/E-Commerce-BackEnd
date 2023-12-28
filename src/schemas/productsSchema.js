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
      },
      stock: {
         type: Number,
         default: 0,
         required: true,
      },
      color: {
         type: String,
      },
      sold: {
         type: Number,
         default: 0,
      },
      images: {
         type: Array,
      },
      reviews: [
         {
            rating: {
               type: Number,
               required: true,
               min: 1,
               max: 5,
            },
            comment: String,
            postedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
            _id: false,
         },
      ],
      averagerating: {
         type: Number,
         default: 0,
      },
      numberofratings: {
         type: Number,
         default: 0,
      },
   },
   {
      timestamps: true,
      versionKey: false,
   }
);

schema.pre("validate", function (next) {
   if (this.category) {
      this.category = slugify(this.category.toLowerCase());
   }
   if (this.brand) {
      this.brand = slugify(this.brand.toLowerCase());
   }
   if (this.color) {
      this.color = slugify(this.color.toLowerCase());
   }
   this.slug = slugify(this.title);

   next();
});

const ProductsModel = mongoose.model("products", schema);

export default ProductsModel;
