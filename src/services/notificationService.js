import Notification from "../models/Notification.js";

// Get all notifications for a user
export const getNotificationsService = async (userId, type, read, limit) => {
    try {
        const query = { userId };

        if (type) query.type = type;
        if (read !== null) query.read = read === "true";

        return await Notification.find(query).sort({ timestamp: -1 }).limit(limit);
    } catch (error) {
        throw new Error("Error fetching notifications");
    }
};

// Create a new notification
export const createNotificationService = async (data) => {
    try {
        const notification = new Notification({
            title: data.title,
            message: data.message,
            type: data.type,
            userId: data.userId,
            relatedId: data.relatedId,
            timestamp: new Date(),
            read: false,
        });

        return await notification.save();
    } catch (error) {
        throw new Error("Error creating notification");
    }
};

// Mark all notifications as read for a user
export const markNotificationsAsReadService = async (userId) => {
    try {
        return await Notification.updateMany({ userId, read: false }, { $set: { read: true } });
    } catch (error) {
        throw new Error("Error marking notifications as read");
    }
};

// Get unread notification count for a user
export const getUnreadCountService = async (userId) => {
    try {
        return await Notification.countDocuments({ userId, read: false });
    } catch (error) {
        throw new Error("Error counting notifications");
    }
};

// Get a single notification by ID
export const getNotificationByIdService = async (id) => {
    try {
        return await Notification.findById(id);
    } catch (error) {
        throw new Error("Error fetching notification");
    }
};

// Update a notification (mark as read)
export const updateNotificationService = async (id, data) => {
    try {
        return await Notification.findByIdAndUpdate(id, { $set: data }, { new: true });
    } catch (error) {
        throw new Error("Error updating notification");
    }
};

// Delete a notification
export const deleteNotificationService = async (id) => {
    try {
        return await Notification.findByIdAndDelete(id);
    } catch (error) {
        throw new Error("Error deleting notification");
    }
};