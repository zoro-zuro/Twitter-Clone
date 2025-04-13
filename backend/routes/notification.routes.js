import express from "express";
import {
  deleteNotification,
  deleteOneNotify,
  getNotifications,
} from "../controller/notification.controller.js";
import authenticateToken from "../utils/auth.js";

const notifyRouter = express.Router();

notifyRouter.get("/all", authenticateToken, getNotifications);

notifyRouter.delete("/", authenticateToken, deleteNotification);

notifyRouter.delete("/one/:id", authenticateToken, deleteOneNotify);

export default notifyRouter;
