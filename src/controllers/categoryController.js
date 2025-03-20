import asyncHandler from "express-async-handler";
import { createCategoryService, updateCategoryService, deleteCategoryService, changeCategoryStatusService, getCategoryByIdService, getAllCategoriesService } from "../services/categoryService.js";
import { body, validationResult } from "express-validator";

export const createCategory = [
    body("name").notEmpty().withMessage("Category name is required"),
    asyncHandler(async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const category = await createCategoryService({ ...req.body, createdBy: req.user.id });
            res.status(201).json({ message: "Category created successfully", category });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    })
];

export const updateCategory = [
    body("name").notEmpty().withMessage("Category name is required"),
    asyncHandler(async (req, res) => {
        try {
            const updatedCategory = await updateCategoryService(req.params.id, req.body, req.user._id);
            res.status(200).json({ message: "Category updated successfully", category: updatedCategory });
        } catch (error) {
            res.status(error.status || 500).json({ message: error.message });
        }
    })
];

export const deleteCategory = asyncHandler(async (req, res) => {
    try {
        await deleteCategoryService(req.params.id);
        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});

export const changeCategoryStatus = asyncHandler(async (req, res) => {
    try {
        const updatedCategory = await changeCategoryStatusService(req.params.id, req.user._id);
        res.status(200).json({ message: "Category status updated successfully", updatedCategory });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});

export const getCategoryById = asyncHandler(async (req, res) => {
    try {
        const category = await getCategoryByIdService(req.params.id);
        res.status(200).json(category);
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});

export const getAllCategories = asyncHandler(async (req, res) => {
    try {
        const categories = await getAllCategoriesService();
        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
