import app from "./app.js";
import connectDB from "./config/db.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = Number(process.env.PORT);

connectDB();

app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
});

