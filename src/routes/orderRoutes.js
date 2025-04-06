import { Router } from "express";
import { createOrder, getAllOrders, getOrderById, updateOrderStatus, getUserOrders } from "../controllers/orderController.js";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/", protect, authorizeRoles("customer"), createOrder);
router.get("/userOrders", protect, authorizeRoles("customer"), getUserOrders);
router.get("/", protect, authorizeRoles("customer", "super_admin", "admin", "user"), getAllOrders);
router.get("/:id", protect, authorizeRoles("customer", "super_admin", "admin", "user"), getOrderById);
router.patch("/:id/status", protect, authorizeRoles("customer", "admin", "super_admin", "user"), updateOrderStatus);


export default router;
