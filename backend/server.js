import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import { v2 as cloudinary } from "cloudinary";

import connectdb from "./db/db.js";
import authRouter from "./routes/auth.routes.js";
import userRouter from "./routes/user.routes.js";
import testRouter from "./routes/test.routes.js";
import postRouter from "./routes/post.routes.js";
import notifyRouter from "./routes/notification.routes.js";
import searchRouter from "./routes/search.route.js";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV;
const app = express();
const _dirname = path.resolve();

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.use("/api/v1/test", testRouter);
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/notify", notifyRouter);
app.use("/api/v1/search", searchRouter);

if (nodeEnv && nodeEnv.toString() === "production") {
  app.use(express.static(path.join(_dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
  });
} else {
  console.log("not working");
}
app.listen(port, () => {
  console.log(`Server running on  http://localhost:${port} in ${nodeEnv}`);
  connectdb();
});
