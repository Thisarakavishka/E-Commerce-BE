import Category from "../models/Category.js";

export const createCategoryService = async (data) => {
    const existingCategory = await Category.findOne({ name: data.name });
    if (existingCategory) {
        throw { status: 400, message: "Category already exists" };
    }
    return await Category.create({
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        createdBy: data.createdBy,
    });
};

export const updateCategoryService = async (id, data, userId) => {
    const category = await Category.findById(id);
    if (!category) {
        throw { status: 404, message: "Category not found" };
    }
    category.name = data.name || category.name;
    category.description = data.description || category.description;
    category.updatedBy = userId;
    return await category.save();
};

export const deleteCategoryService = async (id) => {
    const category = await Category.findById(id);
    if (!category) {
        throw { status: 404, message: "Category not found" };
    }
    await category.deleteOne();
};

export const changeCategoryStatusService = async (id, userId) => {
    const category = await Category.findById(id);
    if (!category) {
        throw { status: 404, message: "Category not found" };
    }
    category.isActive = !category.isActive;
    category.updatedBy = userId;
    return await category.save();
};

export const getCategoryByIdService = async (id) => {
    const category = await Category.findById(id);
    if (!category) {
        throw { status: 404, message: "Category not found" };
    }
    return category;
};

export const getAllCategoriesService = async () => await Category.find();

export const getActiveCategoriesService = async () => await Category.find({ isActive: true });
