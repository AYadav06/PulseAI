import { Request, Response } from "express"
import { userTypes } from "../types";
import bcrypt from "bcrypt";
import  jwt from "jsonwebtoken";
import { ENV } from "../config/env";
import { User } from "../models/user";


const getCookieOptions = () => {
    const isProd = process.env.NODE_ENV?.toLowerCase() === "production";
    return {
        httpOnly: true,
        secure: isProd,
        sameSite: (isProd ? "none" : "lax") as "none" | "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000
    };
};

export const create_user = async (req: Request, res: Response) => {
    try {
        const { success, data } = userTypes.safeParse(req.body);
        if (!success) {
            return res.status(400).json({ message: "Invalid input" });
        }

        const existingUser = await User.findOne({ email: data.email });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email" });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);
        const createUser = await User.create({
            email: data.email,
            password: hashedPassword
        });

        const token = jwt.sign(
            { id: createUser._id },
            ENV.JWT_SECRETE as string,
            { expiresIn: "7d" }
        );

        return res
            .status(201)
            .cookie('access_token', token, getCookieOptions())
            .json({
                message: "User is created...",
                token,
                user: {
                    id: createUser._id,
                    email: createUser.email,
                    credits: createUser.credits,
                    isPremium: createUser.isPremium
                }
            });
    } catch (e) {
        console.error("Signup error details:", e);
        return res.status(500).json({
            message: "Error while signup..."
        });
    }
};

export const sign_user = async (req: Request, res: Response) => {
    try {
        const { data, success } = userTypes.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                message: "Invalid email or password"
            });
        }

        const user = await User.findOne({
            email: data.email,
        });

        if (!user || !user.password) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const matchPassword = await bcrypt.compare(data.password, user.password);

        if (!matchPassword) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(
            { id: user._id },
            ENV.JWT_SECRETE as string,
            { expiresIn: "7d" }
        );

        return res
            .status(200)
            .cookie('access_token', token, getCookieOptions())
            .json({
                message: "Login Successful",
                token,
                user: {
                    id: user._id,
                    email: user.email,
                    credits: user.credits,
                    isPremium: user.isPremium
                }
            });
    } catch (error) {
        console.error("Signin error details:", error);
        return res.status(500).json({
            message: "Error while signing in"
        });
    }
};

export const signout_user = async (req: Request, res: Response) => {
    const isProd = process.env.NODE_ENV?.toLowerCase() === "production";
    return res
        .clearCookie('access_token', {
            httpOnly: true,
            secure: isProd,
            sameSite: isProd ? "none" : "lax" as any
        })
        .json({ message: "logged out successfully." });
};

export const getMe=async(req:Request,res:Response)=>{
    try {
        const user=await User.findById(req.userId).select('-password');
        if(!user){
            return res.status(404).json({ message:"User not found" });
        }
        return res.status(200).json({
            user: { id: user._id, email: user.email, credits: user.credits, isPremium: user.isPremium }
        });
    } catch (error) {
        return res.status(500).json({ message:"Internal server error" });
    }
}