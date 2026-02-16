import express from "express";
import { createProduct, deleteProduct, getAllProduct, getProductById, updateProduct } from "../Controllers/productController.js";

const productRouter = express.Router();

productRouter.get("/",getAllProduct)
productRouter.post("/",createProduct)
productRouter.delete("/:productId",deleteProduct)
productRouter.put("/:productId",updateProduct)
productRouter.get("/:productId",getProductById)


export default productRouter;