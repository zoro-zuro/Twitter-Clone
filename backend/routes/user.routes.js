import express from "express";
import authenticateToken from "../utils/auth.js";
import { getProfile, userNetwork } from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.get("/profile/:username", authenticateToken, getProfile);
// userRouter.get("/suggested", authenticateToken, getSuggest);
userRouter.post("/network/:id", authenticateToken, userNetwork);
// userRouter.post("/update", authenticateToken, updateUser);

export default userRouter;
