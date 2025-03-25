import express from "express";
import authenticateToken from "../utils/auth.js";
import {
  commentPost,
  createPost,
  deletePost,
  toggleLikePost,
} from "../controller/post.controller.js";

const postRouter = express.Router();

postRouter.post("/create", authenticateToken, createPost);
postRouter.delete("/:id", authenticateToken, deletePost);
postRouter.post("/like/:id", authenticateToken, toggleLikePost);
postRouter.post("/comment/:id", authenticateToken, commentPost);

export default postRouter;
