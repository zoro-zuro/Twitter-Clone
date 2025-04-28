import express from "express";
import authenticateToken from "../utils/auth.js";
import findPeople from "../controller/search.controller.js";

const searchRouter = express.Router();

searchRouter.get("/:query", authenticateToken, findPeople);

export default searchRouter;
