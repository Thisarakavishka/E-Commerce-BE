import { Schema, model } from "mongoose";

const notificationSchema = new Schema(
    {
        title: { type: String, required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        read: { type: Boolean, default: false },
        type: { type: String, required: true },
        userId: { type: String, required: true },
        relatedId: { type: String },
    }
)

export default model("Notification", notificationSchema);