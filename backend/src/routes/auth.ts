
import { Router } from "express"
import { create_user, sign_user, signout_user } from "../controllers/auth_controller";

export const userRouter=Router();
userRouter.post("/signup",create_user);
userRouter.post("/signin",sign_user)
userRouter.post("/signout",signout_user);