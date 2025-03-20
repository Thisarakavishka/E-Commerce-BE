import express from "express";
import { protect, authorizeRoles } from "../middlewares/authMiddleware.js";
import { createProduct, updateProduct, changeProductStatus, getAllProducts, getActiveProducts, getProductsByLabel, getProductById, deleteProduct, } from "../controllers/productController.js";
import { upload } from "../utils/imageUpload.js"

const router = express.Router();

router.get("/", getAllProducts);
router.get("/active", getActiveProducts);
router.get("/label/:label", getProductsByLabel);
router.get("/:id", getProductById);
router.post("/", protect, authorizeRoles("super_admin", "admin"), upload.single("image"), createProduct);
router.put("/:id", protect, authorizeRoles("super_admin", "admin"), upload.single("image"), updateProduct);
router.patch("/:id/status", protect, authorizeRoles("super_admin", "admin"), changeProductStatus);
router.delete("/:id", protect, authorizeRoles("super_admin"), deleteProduct);

export default router;