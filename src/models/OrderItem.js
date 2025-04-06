import { Schema, model } from "mongoose";

const orderItemSchema = new Schema(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, default: 1 },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    totalPrice: { type: Number, required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

export default model("OrderItem", orderItemSchema);
