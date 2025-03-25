import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { v2 as cloudinary } from "cloudinary";

import connectdb from "./db/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import testRouter from "./routes/test.routes.js";
import postRouter from "./routes/post.routes.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
dotenv.config();

const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/test", testRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server running on  http://localhost:${port} in ${nodeEnv}`);
  connectdb();
});
