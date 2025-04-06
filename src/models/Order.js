import { Schema, model } from "mongoose";

const orderSchema = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        items: [{ type: Schema.Types.ObjectId, ref: "OrderItem", required: true }],
        totalAmount: { type: Number, required: true },
        status: {
            type: String,
            enum: ["pending", "completed", "cancelled"],
            default: "pending",
        },
        paymentMethod: { type: String, default: "cash" },
    },
    { timestamps: true }
);

export default model("Order", orderSchema);
