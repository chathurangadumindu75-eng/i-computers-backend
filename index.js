import express from "express";

import mongoose from "mongoose";

import userRouter from "./Routers/userRouter.js";
import authenticateUser from "./Middlewares/authentication.js";
import productRouter from "./Routers/productsRouter.js";
import cors from "cors";
import dotenv from "dotenv";

const app = express()
dotenv.config()
const mongodbURI = process.env.MONGO_URI 

mongoose.connect(mongodbURI).then(
    () => {
        console.log("Connected to mongodb");
    }
)
app.use(cors()) //PLUG THE CORS MIDDLEWARE

app.use(express.json())  //PLUG THE MIDDLEWARE 

app.use(authenticateUser) //plug the authentication middleware

app.use("/api/users", userRouter)
app.use("/api/products", productRouter)

app.listen(3001, () => {
    console.log("The  starting server correctly    ...  ")
})



