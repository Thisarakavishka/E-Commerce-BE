import mongoose, { Schema, model } from "mongoose";

const categorySchema = new Schema(
    {
        name: { type: String, required: true, unique: true },
        description: { type: String },
        isActive: { type: Boolean, default: true },
        createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    },
    { timestamps: true }
);

export default model("Category", categorySchema);
