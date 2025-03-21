import mongoose from "mongoose";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";
import { genToken } from "../middleware/genToken.js";

const signup = async (req, res) => {
  try {
    const { username, fullname, email, password } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "Email already exists",
      });
    }
    const userExist = await User.findOne({ username });
    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      fullname,
      email,
      password: hashedPass,
    });

    if (newUser) {
      const token = genToken(newUser._id, res);
      await newUser.save();
      res.status(201).json({
        success: true,
        message: "User registered successfully",
        token,
        newUser,
      });
    } else {
      res.status(400).json({
        success: false,
        message: "User registration failed",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );
    if (!user || !isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = genToken(user._id, res);

    res.json({
      success: true,
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};
export { signup, login, logout, getMe };
