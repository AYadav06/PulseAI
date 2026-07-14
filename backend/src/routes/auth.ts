
import { Router } from "express"
import { create_user, sign_user, signout_user, getMe } from "../controllers/auth_controller";
import { authMiddleware } from "../middleware/authMiddleware";

export const userRouter=Router();
userRouter.post("/signup",create_user);
userRouter.post("/signin",sign_user)
userRouter.post("/signout",signout_user);
userRouter.get("/me", authMiddleware, getMe);