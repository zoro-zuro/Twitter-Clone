import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

import Notification from "../model/notification.model.js";
import User from "../model/user.model.js";

const getProfile = async (req, res) => {
  const { username } = req.params;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
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

const userNetwork = async (req, res) => {
  try {
    const { id } = req.params;
    const userToModify = await User.findById(id);
    const currentUser = await User.findById(req.user._id);

    if (id === req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "You can't follow or unfollow your own profile",
      });
    }

    if (!userToModify || !currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isFollowing = currentUser.following.includes(id);

    if (isFollowing) {
      await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });

      await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });

      res.status(200).json({
        success: true,
        message: `${currentUser.username} unfollowed the user: ${userToModify.username}`,
      });
    } else {
      await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } });

      await User.findByIdAndUpdate(req.user._id, { $push: { following: id } });

      const newNotification = new Notification({
        type: "FOLLOW",
        from: req.user._id,
        to: userToModify._id,
      });

      await newNotification.save();

      res.status(200).json({
        success: true,
        message: `${currentUser.username} followed the user: ${userToModify.username}`,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const suggestedUser = async (req, res) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    const currentUser = await User.findById(userId).select("following");
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "Current user not found",
      });
    }

    const userFollowed = currentUser.following;

    const connections = await User.find({
      _id: { $in: userFollowed },
    }).select("followers following");

    const potentialSuggestions = new Set();
    connections.forEach((user) => {
      user.followers.forEach((followerId) => {
        if (
          !followerId.equals(userId) &&
          !userFollowed.some((id) => id.equals(followerId))
        ) {
          potentialSuggestions.add(followerId.toString());
        }
      });

      user.following.forEach((followingId) => {
        if (
          !followingId.equals(userId) &&
          !userFollowed.some((id) => id.equals(followingId))
        ) {
          potentialSuggestions.add(followingId.toString());
        }
      });
    });

    const suggestedIds = Array.from(potentialSuggestions);

    let userToSuggest = [];

    if (suggestedIds.length > 0) {
      const suggestedUsers = await User.find({
        _id: { $in: suggestedIds.map((id) => new mongoose.Types.ObjectId(id)) },
      }).select("username fullname");
      userToSuggest = suggestedUsers;
    }

    const remaining = 4 - userToSuggest.length;

    if (remaining > 0) {
      const randomUsers = await User.aggregate([
        {
          $match: {
            _id: { $ne: userId },
            _id: {
              $nin: [
                ...userFollowed,
                ...suggestedIds.map((id) => new mongoose.Types.ObjectId(id)),
              ],
            },
          },
        },
        { $sample: { size: remaining } },
        { $project: { username: 1, fullname: 1 } },
      ]);

      userToSuggest = [...userToSuggest, ...randomUsers];
    }

    if (userToSuggest.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No more suggested users",
      });
    }

    res.status(200).json({
      success: true,
      users: userToSuggest,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUser = async (req, res) => {
  const { fullname, email, currentPassword, newPassword, bio, link } = req.body;

  let { profileImg, coverImg } = req.body;

  const id = req.user._id;
  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid user data",
      });
    }

    if (
      (!newPassword && currentPassword) ||
      (!currentPassword && newPassword)
    ) {
      res.status(404).json({
        success: false,
        message: "Please provide current password or new password",
      });
    }

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(user.password, currentPassword);

      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: "Incorrect current password",
        });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: "New password should be at least 6 characters long",
        });
      }

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      await user.save();
    }
    if (coverImg) {
      if (user.coverImg) {
        await cloudinary.uploader.destroy(
          user.coverImg.split("/".pop().split(".")[0])
        );
      }

      const uplodedResponse = await cloudinary.uploader.upload(coverImg);
      coverImg = uplodedResponse.secure_url;
    }

    if (profileImg) {
      if (user.profileImg) {
        await cloudinary.uploader.destroy(
          user.profileImg.split("/".pop().split(".")[0])
        );
      }

      const uplodedResponse = await cloudinary.uploader.upload(profileImg);
      profileImg = uplodedResponse.secure_url;
    }

    const newUser = await User.findByIdAndUpdate(
      id,
      {
        fullname,
        email,
        profileImg,
        coverImg,
        bio,
        link,
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      user: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export { getProfile, userNetwork, suggestedUser, updateUser };
