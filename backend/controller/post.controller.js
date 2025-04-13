import Notification from "../model/notification.model.js";
import Post from "../model/post.model.js";
import User from "../model/user.model.js";
import { v2 as cloudinary } from "cloudinary";

const createPost = async (req, res) => {
  try {
    let { img } = req.body;
    const { text } = req.body;
    const userId = req.user._id.toString();

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!img && !text) {
      return res.status(400).json({
        success: false,
        message: "Text or image is required",
      });
    }
    if (img) {
      const imgResponse = await cloudinary.uploader.upload(img);
      img = imgResponse.secure_url;
    }

    const post = new Post({
      user: userId,
      text,
      img,
    });
    await post.save();
    res.json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const deletePost = async (req, res) => {
  try {
    const postId = req.params.id.toString();

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to delete this post",
      });
    }

    if (post.img) {
      const imgId = post.img.split("/").pop().split(".")[0];

      await cloudinary.uploader.destroy(imgId);
    }

    await Post.findByIdAndDelete(postId);
    res.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const commentPost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { text } = req.body;
    const userId = req.user._id;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: "Text is required",
      });
    }

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    const comment = {
      user: userId,
      text,
    };

    post.comments.push(comment);
    await post.save();
    res.json({
      success: true,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const toggleLikePost = async (req, res) => {
  try {
    const userId = req.user._id;
    const postId = req.params.id;

    const post = await Post.findById(postId);
    if (!post) {
      return res.status(400).json({
        success: false,
        message: "Post is not found",
      });
    }

    if (post.likes.includes(userId)) {
      await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
      await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

      const updatedLikes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
      return res.status(200).json({
        success: true,
        message: "Post unliked successfully",
        data: updatedLikes,
      });
    } else {
      post.likes.push(userId);
      await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });
      await post.save();

      const notification = new Notification({
        from: userId,
        to: post.user,
        type: "LIKE",
      });
      await notification.save();

      const updatedLikes = post.likes;
      return res.status(200).json({
        success: true,
        message: "Post liked successfully",
        data: updatedLikes,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const allPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (posts.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No posts found",
        data: [],
      });
    }
    res.json({
      success: true,
      message: "Posts fetched successfully",
      data: posts.reverse(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getlikedPost = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const likedpst = await Post.find({
      _id: { $in: user.likedPosts },
    })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    res.json({
      success: true,
      message: "Posts fetched successfully",
      data: likedpst,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getfollowingPost = async (req, res) => {
  const userid = req.user._id;

  try {
    const user = await User.findById(userid);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const following = user.following;

    const followingpst = await Post.find({ user: { $in: following } })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (followingpst.length === 0) {
      return res.status(404).json({
        success: true,
        message: "no post found",
      });
    }

    res.status(200).json({
      success: true,
      posts: followingpst,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUserPosts = async (req, res) => {
  const username = req.params.username;

  try {
    const user = await User.findOne({ username });

    if (!user)
      return res.status(404).json({
        success: false,
        message: "user not found",
      });

    const userPost = await Post.find({ user: { $in: user._id } })
      .sort({ createdAt: -1 })
      .populate({
        path: "user",
        select: "-password",
      })
      .populate({
        path: "comments.user",
        select: "-password",
      });

    if (userPost.length === 0) {
      return res.status(404).json({
        success: false,
        message: "no post found",
      });
    }

    res.status(200).json({
      success: true,
      posts: userPost,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export {
  createPost,
  deletePost,
  commentPost,
  toggleLikePost,
  allPosts,
  getlikedPost,
  getfollowingPost,
  getUserPosts,
};
