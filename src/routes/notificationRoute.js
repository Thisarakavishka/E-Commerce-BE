import { Router } from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { getNotifications, createNotification, markNotificationsAsRead, getUnreadCount, getNotificationById, updateNotification, deleteNotification } from "../controllers/notificationController.js";

const router = Router();

router.get("/", protect, authorizeRoles("super_admin", "admin", "user", "customer"), getNotifications);
router.post("/", protect, authorizeRoles("super_admin", "admin", "user", "customer"), createNotification);
router.post("/mark-as-read", protect, authorizeRoles("super_admin", "admin", "user", "customer"), markNotificationsAsRead);
router.get("/unread-count", protect, authorizeRoles("super_admin", "admin", "user", "customer"), getUnreadCount);
router.get("/:id", protect, authorizeRoles("super_admin", "admin", "user", "customer"), getNotificationById);
router.patch("/:id", protect, authorizeRoles("super_admin", "admin", "user", "customer"), updateNotification);
router.delete("/:id", protect, authorizeRoles("super_admin", "admin", "user", "customer"), deleteNotification);

export default router;