import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required."], // Custom message
      unique: true,
    },
    fullname: {
      type: String,
      required: [true, "Full name is required."], // Custom message
    },
    email: {
      type: String,
      unique: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Regex for valid email format
        "Please enter a valid email address.",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required."], // Custom message
      minLength: [8, "Password must be at least 8 characters long."],
    },
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
    profileImg: {
      type: String,
      default: "",
    },
    coverImg: {
      type: String,
      default: "",
    },
    link: {
      type: String,
      default: "",
    },
    bio: {
      type: String,
      default: "",
    },
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
        default: [],
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
