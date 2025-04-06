import { Router } from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { createCategory, updateCategory, deleteCategory, changeCategoryStatus, getCategoryById, getAllCategories, getActiveCategories } from "../controllers/categoryController.js";

const router = Router();

router.get("/", getAllCategories);
router.get("/active", getActiveCategories);
router.post("/", protect, authorizeRoles("super_admin", "admin"), createCategory);
router.get("/:id", protect, authorizeRoles("super_admin", "admin", "user"), getCategoryById);
router.delete("/:id", protect, authorizeRoles("super_admin"), deleteCategory);
router.put("/:id", protect, authorizeRoles("super_admin", "admin"), updateCategory);
router.patch("/:id/status", protect, authorizeRoles("super_admin", "admin"), changeCategoryStatus);

export default router;
