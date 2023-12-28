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
      description: {
         type: String,
         required: true,
         max: 4000,
      },
      category: {
         type: String,
         required: true,
      },
      numViews: {
         type: Number,
         default: 0,
      },
      likes: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
         },
      ],
      dislikes: [
         {
            type: mongoose.Schema.Types.ObjectId,
            ref: "users",
         },
      ],
      images: {
         type: Array,
      },
      author: {
         type: String,
         default: "Admin",
      },
   },
   {
      toJSON: {
         virtuals: true,
      },
      toObject: {
         virtuals: true,
      },
      versionKey: false,
      timestamps: true,
   },
);
schema.pre("validate", function (next) {
   if (this.category) {
      this.category = slugify(this.category.toLowerCase());
   }
   next();
});

const BlogsModel = mongoose.model("blogs", schema);

export default BlogsModel;
