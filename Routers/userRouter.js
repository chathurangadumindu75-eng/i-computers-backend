import express from "express";
import { changePassword, createUser,  loginUser, updateUserData, userData } from "../Controllers/userController.js";

const  userRouter=express.Router()
userRouter.post("/",createUser)
userRouter.post("/login",loginUser)
userRouter.get("/me",userData)
userRouter.put("/",updateUserData)
userRouter.put("/password",changePassword)

export default userRouter;