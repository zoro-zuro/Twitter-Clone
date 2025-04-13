import Notification from "../model/notification.model.js";

const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;

    const notifications = await Notification.find({ to: userId }).populate({
      path: "from",
      select: "username profileImg",
    });

    await Notification.updateMany({ to: userId }, { read: true });

    res.status(200).json({ success: true, notifications });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const userId = req.user._id;

    await Notification.deleteMany({ to: userId });

    res.status(200).json({
      success: true,
      message: "notification is deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteOneNotify = async (req, res) => {
  try {
    const id = req.params?.id;
    const userId = req.user?._id;

    // Validate ID format (MongoDB ObjectId is typically 24 hex characters)
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        message: "Invalid notification ID format",
      });
    }

    // Check if notification exists
    const notiExist = await Notification.findById(id);

    if (!notiExist) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Check if the user is authorized to delete the notification
    if (!notiExist.to || notiExist.to.toString() !== userId?.toString()) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized to delete the notification",
      });
    }

    // Delete the notification with explicit error handling
    const result = await Notification.deleteOne({ _id: id });

    // Check if deletion was successful
    if (result.deletedCount !== 1) {
      return res.status(500).json({
        success: false,
        message: "Failed to delete the notification",
      });
    } else {
      return res.status(200).json({
        success: true,
        message: "Notification deleted successfully",
      });
    }

    // Respond with success
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete notification",
    });
  }
};

export { getNotifications, deleteNotification, deleteOneNotify };
