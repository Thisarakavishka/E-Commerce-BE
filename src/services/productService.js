import Product from "../models/Product.js";
import { deleteImage, saveImage } from "../utils/imageUpload.js";
import { generateProductLabelsForCreate, generateProductLabelsForUpdate } from '../utils/productUtils.js';


export const createProduct = async (data, file, userId) => {
    const { name, description, price, category, stock, discountPrice } = data;

    const numericPrice = parseFloat(price);
    const numericStock = parseInt(stock, 10);
    if (!name || !numericPrice || !category || !numericStock) {
        throw new Error("All required fields must be provided!");
    }

    const existingProduct = await Product.findOne({ name, category });
    if (existingProduct) throw new Error("Product with this name and category already exists!");

    let imagePath = null;
    if (file) imagePath = await saveImage(file);

    // Generate labels for new product
    const labels = generateProductLabelsForCreate(data);

    const product = new Product({
        name,
        description,
        price,
        category,
        stock,
        discountPrice,
        image: imagePath,
        createdBy: userId,
        labels,  // Add labels to new product
    });

    return await product.save();
};

export const updateProduct = async (id, data, file, userId) => {
    const product = await Product.findById(id);
    if (!product) throw { status: 404, message: "Product not found" };

    const { labels } = data;

    // Ensure labels are stored as an array of strings
    if (labels && typeof labels === 'string') {
        data.labels = labels.split(',').map(label => label.trim());
    }

    const { name, category } = data;
    if (name && category) {
        const existingProduct = await Product.findOne({ name, category, _id: { $ne: product._id } });
        if (existingProduct) throw new Error("Another product with this name and category already exists!");
    }

    let image = product.image;
    if (file) {
        if (product.image) await deleteImage(product.image);
        image = await saveImage(file);
    }

    product.set({ ...data, image, updatedBy: userId });
    return await product.save();
};

export const changeProductStatus = async (id) => {
    const product = await Product.findById(id);
    if (!product) throw new Error("Product not found");
    product.isActive = !product.isActive;
    return await product.save();
};

export const getAllProducts = async () => await Product.find().populate("category");

export const getActiveProducts = async () => await Product.find({ isActive: true }).populate("category");

export const getProductsByLabel = async (label) => {
    const products = await Product.find({ isActive: true }).populate("category");
    return products.filter((p) => generateProductLabels(p).includes(label));
};

export const getProductById = async (id) => {
    const product = await Product.findById(id).populate("category");
    if (!product) throw new Error("Product not found");
    return product;
};

export const deleteProduct = async (id, role) => {
    const product = await Product.findById(id);
    if (!product) throw { status: 404, message: "Product not found" };
    if (product.stock > 0 && role !== "super_admin") throw { status: 403, message: "Stock available — Super Admin confirmation required" };

    if (product.image) await deleteImage(product.image);
    return await product.deleteOne();
};
