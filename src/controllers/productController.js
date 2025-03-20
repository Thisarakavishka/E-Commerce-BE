import asyncHandler from "express-async-handler";
import * as productService from "../services/productService.js";

export const createProduct = asyncHandler(async (req, res) => {
    try {
        const savedProduct = await productService.createProduct(req.body, req.file, req.user._id);
        res.status(201).json(savedProduct);
    } catch (error) {
        console.error("Product creation failed:", error);
        res.status(400).json({ message: "Failed to create product", error: error.message });
    }
});

export const updateProduct = asyncHandler(async (req, res) => {
    try {
        const updatedProduct = await productService.updateProduct(req.params.id, req.body, req.file, req.user._id);
        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error("Product update failed:", error);
        res.status(error.status || 400).json({ message: error.message });
    }
});

export const changeProductStatus = asyncHandler(async (req, res) => {
    try {
        const updatedProduct = await productService.changeProductStatus(req.params.id);
        res.status(200).json({ message: "Product status updated", updatedProduct });
    } catch (error) {
        console.error("Product status change failed:", error);
        res.status(400).json({ message: error.message });
    }
});

export const getAllProducts = asyncHandler(async (_, res) => {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
});

export const getActiveProducts = asyncHandler(async (_, res) => {
    const products = await productService.getActiveProducts();
    res.status(200).json(products);
});

export const getProductsByLabel = asyncHandler(async (req, res) => {
    const { label } = req.params;
    const products = await productService.getProductsByLabel(label);
    res.status(200).json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
    try {
        const product = await productService.getProductById(req.params.id);
        res.status(200).json(product);
    } catch (error) {
        console.error("Get product by ID failed:", error);
        res.status(404).json({ message: "Product not found" });
    }
});

export const deleteProduct = asyncHandler(async (req, res) => {
    try {
        await productService.deleteProduct(req.params.id, req.user.role);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Product deletion failed:", error);
        res.status(error.status || 500).json({ message: error.message });
    }
});