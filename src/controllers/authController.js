import User from "../models/User.js";
import { hash, compare } from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

export const registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });

    res.status(201).json({ token: generateToken(user._id, user.role), user });
};

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await compare(password, user.password)

    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    res.json({ token: generateToken(user._id, user.role), user });
};