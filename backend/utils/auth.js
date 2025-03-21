import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(403).json({
        success: false,
        message: "No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded) {
      return res.status(403).json({
        success: false,
        message: "Token invalid",
      });
    }

    const user = await User.findById(decoded.userid).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Authentication failed",
    });
  }
};

export default authenticateToken;
