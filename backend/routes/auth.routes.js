import express from "express";

const authRouter = express.Router();

authRouter.post("/signup", (req, res) => {
  res.json({
    message: "signup successful",
  });
});
authRouter.post("/login", (req, res) => {
  res.json({
    message: "Login successful",
  });
});

authRouter.delete("/logout", (req, res) => {
  res.json({
    message: "logout successful",
  });
});
export default authRouter;
