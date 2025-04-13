import express from "express";
import authenticateToken from "../utils/auth.js";
import {
  allPosts,
  commentPost,
  createPost,
  deletePost,
  getfollowingPost,
  getlikedPost,
  getUserPosts,
  toggleLikePost,
} from "../controller/post.controller.js";

const postRouter = express.Router();

postRouter.get("/all", authenticateToken, allPosts);
postRouter.post("/create", authenticateToken, createPost);
postRouter.delete("/:id", authenticateToken, deletePost);
postRouter.post("/like/:id", authenticateToken, toggleLikePost);
postRouter.post("/comment/:id", authenticateToken, commentPost);
postRouter.get("/likes/:id", authenticateToken, getlikedPost);
postRouter.get("/followingpst", authenticateToken, getfollowingPost);
postRouter.get("/userPost/:username", authenticateToken, getUserPosts);
export default postRouter;
