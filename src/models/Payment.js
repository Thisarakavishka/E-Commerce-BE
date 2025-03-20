import { Schema, model } from "mongoose";

const paymentSchema =new Schema(
    {
        order: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        amount: { type: Number, required: true },
        paymentMethod: {
            type: String,
            enum: ["credit_card", "debit_card", "paypal", "cash_on_delivery"],
            required: true,
        },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending"
        },
    },
    { timestamps: true }
);

export default model("Payment", paymentSchema);
