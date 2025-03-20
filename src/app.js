import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import errorHandler from "./middlewares/errorMiddleware.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));
app.use(helmet({
    crossOriginResourcePolicy: false,
}));
app.use(morgan("dev"));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);

app.use("/uploads", express.static("uploads", {
    setHeaders: (res) => {
        res.set("Access-Control-Allow-Origin", "*");
        res.set("Cross-Origin-Resource-Policy", "cross-origin");
    },
}));

app.use("/api/products", productRoutes);
app.use(errorHandler);

export default app;