import OrderItem from "../models/OrderItem.js";
import Product from "../models/Product.js";

export const createOrderItemService = async (productId, quantity, userId) => {
    const product = await Product.findById(productId);
    if (!product || !product.isActive) throw new Error("Product not found or inactive");

    const price = product.discountPrice > 0 ? product.discountPrice : product.price;
    const totalPrice = price * quantity;

    return await OrderItem.create({
        product: productId,
        user: userId,
        quantity,
        price,
        discountPrice: product.discountPrice,
        totalPrice,
    });
};

export const getUserCartService = async (userId) => {
    return await OrderItem.find({ user: userId }).populate("product");
};

export const deleteOrderItemService = async (orderItemId, userId) => {
    const orderItem = await OrderItem.findOne({ _id: orderItemId, user: userId });
    if (!orderItem) throw new Error("Order item not found");
    return await orderItem.deleteOne();
};
