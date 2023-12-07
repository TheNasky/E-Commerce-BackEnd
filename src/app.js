import express from "express";
import "dotenv/config";

import session from "express-session";
import passport from "passport";
import initializePassport from "./config/passport.js";
import compression from "compression";
import MongoStore from "connect-mongo";
import { connectDb } from "./config/utils/mongoConnect.js";
import { addLogger } from "./config/logger.js"; // Import logger and addLogger

import authRouter from "./routers/authRouter.js";
import usersRouter from "./routers/usersRouter.js";
import productsRouter from "./routers/productsRouter.js";
import blogsRouter from "./routers/blogsRouter.js";

connectDb();
const PORT = process.env.PORT || 3000;
const app = express();
app.listen(PORT, () => {
   console.log("listening on port: " + PORT);
});

// Middlewares //

app.use(express.json()); // Parse JSON requests
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded requests
app.use(
   session({
      store: MongoStore.create({
         mongoUrl: process.env.MONGO_URL,
         ttl: 3600,
         dbName: "E-Commerce",
      }),
      secret: process.env.SESSION_SECRET,
      resave: true,
      saveUninitialized: true,
   })
);

// initializePassport();
// app.use(passport.initialize());
// app.use(passport.session());
app.use(addLogger);
app.use(compression({})); // Enable response compression

// Routers //

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);
app.use("/api/products", productsRouter);
app.use("/api/blogs", blogsRouter);
// Error handlers //

//  Bad JSON //
app.use((err, req, res, next) => {
   if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
      res.status(400).json({ error: "Invalid JSON" });
   } else {
      next(err);
   }
});

// Catch all //
app.use((err, req, res, next) => {
   res.status(500).json({ error: "Internal Server Error (Catch all)" });
});
