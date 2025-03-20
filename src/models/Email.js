import { Schema, model } from "mongoose";

const emailNotificationSchema = new Schema(
    {
        to: { type: String, required: true },
        subject: { type: String, required: true },
        message: { type: String, required: true },
        status: {
            type: String,
            enum: ["pending", "sent", "failed"],
            default: "pending"
        },
    },
    { timestamps: true }
);

export default model("EmailNotification", emailNotificationSchema);
