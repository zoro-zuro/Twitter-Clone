import { User } from "../model/user.model.js";

const signup = async (req, res) => {
  try {
    const {} = req.body;
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};
