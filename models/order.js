import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderId:{
            type: String,
            required: true,
            unique: true     //ORD-20240615-0000001
        },
        email :{
            type: String,
            required: true
        },
        firstName :{
            type: String,
            required: true       
        },
        lastName :{
            type: String,
            required: true
        },
        addressLineOne :{
            type: String,
            required: true
        },
        addressLineTwo :{
            type: String,
            required: false
        },
        city :{
            type: String,
            required: true      
        },
        state :{
            type: String,
            required: true
        },
        postalCode :{
            type: String,
            required: true
        },
        status:{
            type: String,
            required: true,
            default: "pending"       //pending, packing, shipped, completed, cancelled
        },
        notes:{
            type: String,
            required: false
        },
        total :{
            type: Number,
            required: true
        },
        date :{
            type: Date,
            required: true,
            default: Date.now
        }, 
        phone :{
            type:String,
            required:true
        },
        items:[
            {
                productId: {
                    type: String,
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                price: {
                    type: Number,
                    required: true
                },
                lablledPrice: {
                    type: Number,
                    required: true
                },
                image:{
                    type: String,
                    required: true
                },
                qty: {
                    type: Number,
                    required: true
                }
            }
        ]
    }
)

const Order = mongoose.model("Order", orderSchema);
export default Order;