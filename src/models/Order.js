import { Schema, model } from "mongoose";

const orderSchema = new Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
            },
        ],
        totalAmount: { type: Number, required: true },
        paymentMethod: {
            type: String,
            enum: ["credit_card", "debit_card", "paypal", "cash_on_delivery"],
            required: true,
        },
        status: {
            type: String,
            enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
            default: "pending",
        },
        deliveryDate: { type: Date },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Admin or User
    },
    { timestamps: true }
);

export default model("Order", orderSchema);
