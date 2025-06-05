import { getNotificationsService, deleteNotificationService, createNotificationService, markNotificationsAsReadService, updateNotificationService, getNotificationByIdService, getUnreadCountService } from "../services/notificationService.js";

// Get all notifications for a user
export const getNotifications = async (req, res) => {
    try {
        const { userId, type, read, limit } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const notifications = await getNotificationsService(userId, type, read, limit);
        return res.json(notifications);
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

// Create a new notification
export const createNotification = async (req, res) => {
    try {
        const { title, message, type, userId, relatedId } = req.body;

        if (!title || !message || !type || !userId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const notification = await createNotificationService({
            title,
            message,
            type,
            userId,
            relatedId,
        });

        return res.status(201).json(notification);
    } catch (error) {
        console.error("Error creating notification:", error);
        return res.status(500).json({ error: "Failed to create notification" });
    }
};

// Mark notifications as read
export const markNotificationsAsRead = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const result = await markNotificationsAsReadService(userId);

        return res.json({
            success: true,
            modifiedCount: result.modifiedCount,
        });
    } catch (error) {
        console.error("Error marking notifications as read:", error);
        return res.status(500).json({ error: "Failed to mark notifications as read" });
    }
};

// Get unread notification count for a user
export const getUnreadCount = async (req, res) => {
    try {
        const { userId } = req.query;

        if (!userId) {
            return res.status(400).json({ error: "User ID is required" });
        }

        const unreadCount = await getUnreadCountService(userId);
        return res.json({ unreadCount });
    } catch (error) {
        console.error("Error counting notifications:", error);
        return res.status(500).json({ error: "Failed to count notifications" });
    }
};

// Get a single notification
export const getNotificationById = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await getNotificationByIdService(id);

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        return res.json(notification);
    } catch (error) {
        console.error("Error fetching notification:", error);
        return res.status(500).json({ error: "Failed to fetch notification" });
    }
};

// Update a notification (mark as read)
export const updateNotification = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;

        const notification = await updateNotificationService(id, data);

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        return res.json(notification);
    } catch (error) {
        console.error("Error updating notification:", error);
        return res.status(500).json({ error: "Failed to update notification" });
    }
};

// Delete a notification
export const deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        const notification = await deleteNotificationService(id);

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        return res.json({ success: true });
    } catch (error) {
        console.error("Error deleting notification:", error);
        return res.status(500).json({ error: "Failed to delete notification" });
    }
};
