import mongoose from "mongoose";

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
      image: {
         type: String,
         default: "https://cdn.logojoy.com/wp-content/uploads/2018/05/30164225/572.png",
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
   }
);

const BlogsModel = mongoose.model("blogs", schema);

export default BlogsModel;
