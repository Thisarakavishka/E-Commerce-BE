import { Schema, model } from "mongoose";

const productSchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        price: { type: Number, required: true },
        discountPrice: { type: Number, default: 0 },
        category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
        stock: { type: Number, default: 0 },
        salesCount: { type: Number, default: 0 },
        image: { type: String },
        labels: {
            type: [String],
            enum: ["featured", "new", "hot", "top selling", "discount"],
            required: false
        },
        isActive: { type: Boolean, default: true },
        createdBy: { type: Schema.Types.ObjectId, ref: "User" },
        updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default model("Product", productSchema);
