import express from "express";
import authenticateToken from "../utils/auth.js";
import {
  getProfile,
  suggestedUser,
  updateUser,
  userNetwork,
} from "../controller/user.controller.js";

const userRouter = express.Router();

userRouter.get("/profile/:username", authenticateToken, getProfile);

userRouter.get("/suggested", authenticateToken, suggestedUser);
userRouter.post("/network/:id", authenticateToken, userNetwork);
userRouter.put("/update", authenticateToken, updateUser);

export default userRouter;
