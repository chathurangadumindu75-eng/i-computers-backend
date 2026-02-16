import express from "express";

import mongoose from "mongoose";

import userRouter from "./Routers/userRouter.js";
import authenticateUser from "./Middlewares/authentication.js";
import productRouter from "./Routers/productsRouter.js";

const app = express()

const mongodbURI = "mongodb+srv://Admin:1234@cluster0.nsa5qhc.mongodb.net/icomputers?appName=Cluster0"

mongoose.connect(mongodbURI).then(
    () => {
        console.log("Connected to mongodb");
    }
)

app.use(express.json())  //PLUG THE MIDDLEWARE 

app.use(authenticateUser) //plug the authentication middleware

app.use("/users", userRouter)
app.use("/product",productRouter)

app.listen(3001, () => {
    console.log("The  starting server correctly    ...  ")
})



