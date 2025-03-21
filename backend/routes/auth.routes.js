import express from "express";
import { getMe, login, logout, signup } from "../controller/auth.controller.js";
import authenticateToken from "../utils/auth.js";

const authRouter = express.Router();

authRouter.post("/signup", signup);

authRouter.post("/login", login);

authRouter.delete("/logout", logout);

authRouter.get("/me", authenticateToken, getMe);
export default authRouter;
