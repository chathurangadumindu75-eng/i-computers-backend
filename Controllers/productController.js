import Product from "../models/product.js";
import { isAdmin } from "./userController.js";

export async function createProduct(req, res) {
    if (req.user == null) {
        req.status(401).json({
            massage: "You need to login first."
        })
        return
    }
    if (!isAdmin(req)) {
        req.status(403), json({
            massage: "You don't have the permission to perform this action"                 //vallidation
        })
        return
    }
    try {
        const existingProduct = await Product.findOne({
            productId: req.body.Product
        })
        if (existingProduct != null) {                                                       //vallidation
            res.status(400).json({
                massage: "Product with this productId already  exists."
            })
            return
        }
        const newProduct = new Product({
            productId: req.body.productId,
            name: req.body.name,
            altNames: req.body.altNames,
            price: req.body.price,
            lablledPrice: req.body.lablledPrice,
            decription: req.body.decription,
            images: req.body.images,
            brand: req.body.brand,
            model: req.body.model,
            category: req.body.category,
            isAvailable: req.body.isAvailable,
            stock: req.body.stock
        })
        await newProduct.save()

        res.status(201).json({
            massage: "Product created successfully"
        })

    } catch (error) {
        res.status(500).json({
            massage: "Error creating products"
        })
    }
}

export async function getAllProduct(req, res) {
    try {
        if (isAdmin(req)) {
            const products = await Product.find();
            res.json(products)
        } else {
            const products = await Product.find({ isAvailable: true });
            res.json(products)
        }

    } catch (error) {
        res.status(500).json({
            massage: "Products getting unsuccessful!"
        })
    }
}

export async function deleteProduct(req, res) {
    if (!isAdmin) {
        res.status(403).json({
            massage: "Access denied.Admins only."
        })
    } else {
        try {
            await Product.deleteOne({
                productId: req.params.productId
            })
            res.json({
                massage: "Product deleted"
            })
        } catch (error) {
            res.status(500).json({
                massage: "Unsuccessfully delete this product"
            })
        }
    }
}

export async function updateProduct(req, res) {
    if (!isAdmin) {
        res.status(403).json({
            massage: "Access denied.Admins only."
        })
    } else {
        try {
            await Product.updateOne({
                productId: req.params.productId
            }, {
                name: req.body.name,
                altNames: req.body.altNames,
                price: req.body.price,
                lablledPrice: req.body.lablledPrice,
                decription: req.body.decription,
                images: req.body.images,
                brand: req.body.brand,
                model: req.body.model,
                category: req.body.category,
                isAvailable: req.body.isAvailable,
                stock: req.body.stock
            })
            res.json({
                massage: "Product update successfully!"
            })
        } catch (error) {
            res.status(500).json({
                massage: "Unsuccessfully update this product"
            })
        }
    }
}

export async function getProductById(req, res) {
    try {
        const product = await Product.findOne({
            productId: req.params.productId
        })
        if (product == null) {
            res.status(404).json({
                massage: "Product not found"
            })
        } else {
            if (product.isAvailable) {
                res.json(product)
            } else {
                if (isAdmin(req)) {
                    res.json(product)
                } else {
                    res.status(403).json({
                        massage: "Access denied.Admins only."
                    })
                }
            }
        }
    } catch (error) {
        res.status(500).json({
            massage: "Unsuccessfully find this product"
        })
    }
}