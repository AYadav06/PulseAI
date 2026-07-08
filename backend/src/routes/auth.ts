
import { Router } from "express"
import { create_user, sign_user } from "../controllers/auth-controller";

export const userRouter=Router();
userRouter.post("/signup",create_user);
userRouter.post("/signin",sign_user)
userRouter.post("/signout",()=>{
})