import express from "express";

import mongoose from "mongoose";

import userRouter from "./Routers/userRouter.js";
import authenticateUser from "./Middlewares/authentication.js";
import productRouter from "./Routers/productsRouter.js";
import cors from "cors";
import dotenv from "dotenv";                    //secure karanna ona dewal hanganna udaw karanwa 
import orderRouter from "./Routers/orderRouter.js";

const app = express()
dotenv.config()
const mongodbURI = process.env.MONGO_URI 

mongoose.connect(mongodbURI).then(
    () => {
        console.log("Connected to mongodb");
    }
)
app.use(cors()) //PLUG THE CORS MIDDLEWARE         //wedakata nathi request iwath karanna udaw karanwa

app.use(express.json())  //PLUG THE MIDDLEWARE 

app.use(authenticateUser) //plug the authentication middleware

app.use("/users", userRouter)
app.use("/products", productRouter)
app.use("/orders", orderRouter)

app.listen(3001, () => {
    console.log("The  starting server correctly    ...  ")
})



