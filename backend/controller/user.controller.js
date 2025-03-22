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

    if (id === req.user._id) {
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

export { getProfile, userNetwork };
