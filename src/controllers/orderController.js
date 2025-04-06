import { startSession } from "mongoose";
import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";

export const createOrder = asyncHandler(async (req, res) => {
    const { cartItems } = req.body;
    const userId = req.user._id;

    if (!cartItems || cartItems.length === 0) {
        return res.status(400).json({ message: "Cart is empty!" });
    }

    // Start MongoDB session for transactions
    const session = await startSession();
    session.startTransaction();

    try {
        let orderItems = [];
        let totalAmount = 0;

        // Process each cart item
        for (const item of cartItems) {
            const product = await Product.findById(item._id).session(session);

            if (!product) {
                throw new Error(`Product not found: ${item._id}`);
            }

            if (product.stock < item.quantity) {
                throw new Error(`Not enough stock for product: ${product.name}`);
            }

            // Calculate total price with discount applied
            const itemTotalPrice = (product.price * item.quantity) - (product.discountPrice * item.quantity || 0);

            // Create an order item
            const orderItem = await OrderItem.create([
                {
                    product: product._id,
                    quantity: item.quantity,
                    price: product.price,
                    discountPrice: product.discountPrice || null,
                    totalPrice: itemTotalPrice,
                    user: userId,
                },
            ], { session });

            orderItems.push(orderItem[0]._id);
            totalAmount += itemTotalPrice;

            // Update product stock and sales
            await Product.updateOne(
                { _id: product._id },
                { $inc: { stock: -item.quantity, salesCount: item.quantity } },
                { session }
            );
        }

        // Create the main order
        const order = await Order.create([
            {
                user: userId,
                items: orderItems,
                totalAmount,
                status: "pending",
            },
        ], { session });

        // Commit transaction if everything is successful
        await session.commitTransaction();
        session.endSession();

        res.status(201).json({
            message: "Order placed successfully!",
            order: order[0],
        });

    } catch (error) {
        // Rollback if any error occurs
        await session.abortTransaction();
        session.endSession();

        res.status(400).json({ message: error.message });
    }
});

export const getAllOrders = asyncHandler(async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({
                path: "items",
                populate: {
                    path: "product",
                    model: "Product"
                }
            })
            .populate("user", "name email");

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
});

export const getOrderById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findById(id)
            .populate({
                path: "items",
                populate: {
                    path: "product",
                    model: "Product"
                }
            })
            .populate("user", "name email");
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch order", error: error.message });
    }
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["completed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        const order = await Order.findById(id);
        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: "Order status updated successfully", order });
    } catch (error) {
        res.status(500).json({ message: "Failed to update order status", error: error.message });
    }
});

export const getUserOrders = asyncHandler(async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ user: userId })
            .populate({
                path: "items",
                populate: {
                    path: "product",
                    model: "Product"
                }
            })
            .populate("user", "name email");

        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch orders", error: error.message });
    }
});
