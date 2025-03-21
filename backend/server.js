import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectdb from "./db/db.js";
import authRouter from "./routes/auth.routes.js";

dotenv.config();

const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV;
const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1", authRouter);
app.get("/", (req, res) => {
  res.send("Hello, World!");
});

app.listen(port, () => {
  console.log(`Server running on  http://localhost:${port} in ${nodeEnv}`);
  connectdb();
});
