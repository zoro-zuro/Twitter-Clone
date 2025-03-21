import { Schema } from "mongoose";
import { model } from "mongoose";
const userShema = Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  posts: [{ type: Schema.Types.ObjectId, ref: "Post" }],
});

export const User = model("user", userShema);
