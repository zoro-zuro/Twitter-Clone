import mongoose from "mongoose";
import User from "../model/user.model.js";
import bcrypt from "bcryptjs";

const insertMany = async (req, res) => {
  try {
    const users = req.body;

    if (!users || users.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No users provided",
      });
    }

    const proccesedUsers = await Promise.all(
      users.map(async (user) => {
        const salt = await bcrypt.genSalt(10);
        const hashedPss = await bcrypt.hash(user.password, salt);

        return { ...user, password: hashedPss };
      })
    );

    if (proccesedUsers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid users provided",
      });
    }

    const newUsers = await User.insertMany(proccesedUsers);

    res.status(201).json({
      success: true,
      message: "Users inserted successfully",
      newUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

export default insertMany;
