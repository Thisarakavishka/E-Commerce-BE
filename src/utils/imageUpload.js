import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = path.resolve("uploads/products");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
    if (!allowedTypes.includes(file.mimetype)) {
        return cb(new Error("Only JPEG, PNG, and JPG files are allowed"), false);
    }
    cb(null, true);
};

export const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter,
});

export const saveImage = async (file) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    return `uploads/products/${fileName}`;
};

export const deleteImage = async (filePath) => {
    try {
        const fullPath = path.join(process.cwd(), filePath);
        console.log("Deleting file:", fullPath);

        if (fs.existsSync(fullPath)) {
            fs.unlinkSync(fullPath);
            console.log("Image deleted:", fullPath);
        } else {
            console.warn("Image not found:", fullPath);
        }
    } catch (error) {
        console.error("Failed to delete image:", error);
    }
};

