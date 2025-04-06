import asyncHandler from "express-async-handler";
import { validationResult } from "express-validator";
import { getAllAdminsService, getAllUsersService, getUserByIdService, createUserService, updateUserService, deleteUserService, updateUserProfileService, getUserProfileService, changeUserStatusService, getAllCustomersService, getCustomerByIdService } from "../services/userService.js";

export const getCustomers = asyncHandler(async (req, res) => {
    const customers = await getAllCustomersService();
    res.status(200).json(customers);
});

export const getCustomerById = asyncHandler(async (req, res) => {
    const user = await getCustomerByIdService(req.params.id, req.user);
    res.status(200).json(user);
});





export const getAllAdmins = asyncHandler(async (req, res) => {
    const admins = await getAllAdminsService();
    res.status(200).json(admins);
});

export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await getAllUsersService();
    res.status(200).json(users);
});

export const getUserById = asyncHandler(async (req, res) => {
    const user = await getUserByIdService(req.params.id, req.user);
    res.status(200).json(user);
});

export const createUser = asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    const newUser = await createUserService(req.body, req.user);
    res.status(201).json({
        message: "User created successfully",
        user: newUser,
    });
});

export const updateUser = asyncHandler(async (req, res) => {
    const updatedUser = await updateUserService(req.params.id, req.body, req.user);
    res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
    });
});

export const deleteUser = asyncHandler(async (req, res) => {
    await deleteUserService(req.params.id);
    res.status(200).json({ message: "User deleted successfully" });
});

export const getProfile = asyncHandler(async (req, res) => {
    console.log("on controller");
    const userProfile = await getUserProfileService(req.user._id);

    res.status(200).json({
        message: "Profile fetched successfully",
        user: userProfile,
    });
});

export const updateProfile = asyncHandler(async (req, res) => {
    const updatedUser = await updateUserProfileService(req.user._id, req.body);
    res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser,
    });
});

export const changeUserStatus = asyncHandler(async (req, res) => {
    try {
        const updatedUser = await changeUserStatusService(req.params.id, req.user);
        res.status(200).json({ message: "User status updated successfully", user: updatedUser });
    } catch (error) {
        res.status(error.status || 500).json({ message: error.message });
    }
});