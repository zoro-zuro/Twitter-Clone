import express from "express";
import insertMany from "../controller/test.controller.js";

const testRouter = express.Router();

testRouter.post("/insert", insertMany);

export default testRouter;
