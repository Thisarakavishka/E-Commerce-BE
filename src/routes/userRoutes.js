import { Router } from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { getAllAdmins, getAllUsers, getUserById, updateUser, deleteUser, createUser, updateProfile, getProfile, changeUserStatus, getCustomers, getCustomerById } from "../controllers/userController.js";

const router = Router();

router.get("/customers", protect, authorizeRoles("super_admin", "admin", "user"), getCustomers);
router.get("/customers/:id", protect, authorizeRoles("super_admin", "admin", "user"), getCustomerById);


router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.get("/admins", protect, authorizeRoles("super_admin"), getAllAdmins);
router.get("/users", protect, authorizeRoles("admin", "super_admin"), getAllUsers);
router.get("/:id", protect, authorizeRoles("admin", "super_admin"), getUserById);
router.post("/", protect, authorizeRoles("admin", "super_admin"), createUser);
router.put("/:id", protect, authorizeRoles("admin", "super_admin"), updateUser);
router.delete("/:id", protect, authorizeRoles("super_admin"), deleteUser);
router.patch("/:id/status", protect, authorizeRoles("super_admin", "admin"), changeUserStatus);

export default router;
