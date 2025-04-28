import User from "../model/user.model.js";
import Post from "../model/post.model.js";

const findPeople = async (req, res) => {
  try {
    const query = req.params.query;

    if (!query) {
      return res.status(404).json({
        success: false,
        message: "Query is not found the api",
      });
    }

    const regex = RegExp(query, "i");

    const peoples = await User.find({ username: regex });

    if (peoples.length < 0) {
      return res.status(200).json({
        success: true,
        peoples: [],
        message: "no user found",
      });
    }

    res.status(200).json({
      success: true,
      peoples,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default findPeople;
