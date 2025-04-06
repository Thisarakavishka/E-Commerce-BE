import User from "../models/User.js";
import { hash } from "bcryptjs";

export const getAllCustomersService = async () => {
    return await User.find({ role: "customer" });
};

export const getCustomerByIdService = async (id, requestingUser) => {
    const userToFetch = await User.findById(id);
    if (!userToFetch) throw { status: 404, message: "User not found" };
    return userToFetch;
};







export const getAllAdminsService = async () => {
    return await User.find({ role: "admin" }).select("-password");
};

export const getAllUsersService = async () => {
    return await User.find({ role: "user" }).select("-password");
};

export const getUserByIdService = async (id, requestingUser) => {
    const userToFetch = await User.findById(id).select("-password");
    if (!userToFetch) throw { status: 404, message: "User not found" };

    // Super Admin cannot fetch other Super Admins
    if (requestingUser.role === "super_admin" && userToFetch.role === "super_admin") {
        throw { status: 403, message: "Super Admins cannot fetch other Super Admins" };
    }

    // Admins can only fetch normal users
    if (requestingUser.role === "admin" && userToFetch.role !== "user") {
        throw { status: 403, message: "Admins can only fetch normal users" };
    }

    return userToFetch;
};

export const createUserService = async (data, requestingUser) => {
    const { name, email, password, role } = data;

    // Super Admins cannot create other Super Admins
    if (requestingUser.role === "super_admin" && role === "super_admin") {
        throw { status: 403, message: "Super Admins cannot create other Super Admins" };
    }

    // Admins can only create normal users
    if (requestingUser.role === "admin" && role !== "user") {
        throw { status: 403, message: "Admins can only create normal users" };
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) throw { status: 400, message: "User with this email already exists" };

    const hashedPassword = await hash(password, 10);

    return await User.create({
        name,
        email,
        password: hashedPassword,
        role,
        createdBy: requestingUser._id,
    });
};

export const updateUserService = async (id, data, requestingUser) => {
    const userToUpdate = await User.findById(id);
    if (!userToUpdate) throw { status: 404, message: "User not found" };

    // Super Admins cannot update other Super Admins
    if (requestingUser.role === "super_admin" && userToUpdate.role === "super_admin") {
        throw { status: 403, message: "Super Admins cannot update other Super Admins" };
    }

    // Admins can only update normal users
    if (requestingUser.role === "admin" && userToUpdate.role !== "user") {
        throw { status: 403, message: "Admins can only update normal users" };
    }

    // Update only allowed fields
    userToUpdate.name = data.name || userToUpdate.name;
    userToUpdate.email = data.email || userToUpdate.email;
    userToUpdate.updatedBy = requestingUser._id;

    return await userToUpdate.save();
};

export const deleteUserService = async (id) => {
    const user = await User.findById(id);
    if (!user) throw { status: 404, message: "User not found" };

    // Super Admin cannot be deleted
    if (user.role === "super_admin") {
        throw { status: 403, message: "Super Admin cannot be deleted" };
    }

    await user.deleteOne();
};

export const getUserProfileService = async (userId) => {
    const user = await User.findById(userId).select("-password");

    if (!user) throw { status: 404, message: "User not found" };

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
    };
};

export const updateUserProfileService = async (userId, data) => {
    const user = await User.findById(userId);

    if (!user) throw { status: 404, message: "User not found" };

    user.name = data.name || user.name;
    user.email = data.email || user.email;

    if (data.password) {
        if (data.password.length < 6) throw { status: 400, message: "Password must be at least 6 characters" };
        user.password = await hash(data.password, 10);
    }

    const updatedUser = await user.save();

    return {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
    };
};

export const changeUserStatusService = async (id, currentUser) => {
    const user = await User.findById(id);
    if (!user) throw { status: 404, message: "User not found" };

    const currentRole = currentUser.role;
    const targetRole = user.role;

    if (currentRole === "super_admin" && targetRole === "super_admin") {
        throw { status: 403, message: "Forbidden: Cannot modify another super admin" };
    }

    if (currentRole === "admin" && (targetRole === "super_admin" || targetRole === "admin")) {
        throw { status: 403, message: "Forbidden: Cannot modify admins or super admins" };
    }

    if (currentRole === "user" || currentRole === "customer") {
        throw { status: 403, message: "Forbidden: You don't have permission to perform this action" };
    }

    user.isActive = !user.isActive;
    user.updatedBy = currentUser._id;

    return await user.save();
};