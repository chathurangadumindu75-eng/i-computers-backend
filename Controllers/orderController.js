import Order from "../models/order.js";
import Product from "../models/product.js";

export default async function createOrder(req, res) {
    const user = req.user;

    // පරිශීලකයා login වී ඇත්දැයි පරීක්ෂා කිරීම
    if (!user) {
        return res.status(401).json({
            message: "You need to be logged in to place the order."
        });
    }

    try {
        // මූලික Order දත්ත ව්‍යුහය සෑදීම
        const orderData = {
            orderId: "", 
            email: user.email,
            firstName: req.body.firstName || user.firstName,
            lastName: req.body.lastName || user.lastName,
            addressLineOne: req.body.addressLineOne,
            addressLineTwo: req.body.addressLineTwo,
            city: req.body.city,
            state: req.body.state,
            postalCode: req.body.postalCode,
            phone: req.body.phone,
            items: [],
            total: 0
        };

        // 1. අලුත්ම Order ID එකක් උත්පාදනය කිරීම
        const lastOrder = await Order.findOne().sort({ date: -1 });
        let newOrderNum = 1;

        if (lastOrder && lastOrder.orderId) {
            const lastOrderId = lastOrder.orderId;
            const lastOrderNum = parseInt(lastOrderId.replace("ORD-", ""));
            newOrderNum = lastOrderNum + 1;
        }
        orderData.orderId = "ORD-" + newOrderNum.toString().padStart(8, "0");

        // 2. Items පරීක්ෂා කිරීම සහ එකතු කිරීම[cite: 5, 6]
        for (let i = 0; i < req.body.items.length; i++) {
            const itemFromReq = req.body.items[i];
            const product = await Product.findOne({ productId: itemFromReq.productId });

            if (!product || !product.isAvailable) {
                return res.status(400).json({
                    message: `Product with ID ${itemFromReq.productId} is not available.`
                });
            }

            // Schema එකේ ඉල්ලන සියලුම fields මෙහි ඇතුළත් කර ඇත
            const itemQty = itemFromReq.qty || 1; 

            orderData.items.push({
                productId: product.productId,
                name: product.name,
                price: product.price,
                lablledPrice: product.lablledPrice,
                image: product.images[0], // Product Schema එකේ 'images' array එකක්
                qty: itemQty
            });

            // මුළු මුදල ගණනය කිරීම
            orderData.total += product.price * itemQty;
        }

        // 3. Database එකේ Save කිරීම[cite: 5]
        const newOrder = new Order(orderData);
        await newOrder.save();

        res.status(201).json({
            message: "Order created successfully.",
            orderId: newOrder.orderId
        });

    } catch (error) {
        console.error("Error creating the order:", error);
        res.status(500).json({
            message: "Error creating the order.",
            error: error.message
        });
    }
}

export async function getOrders(req,res) {
    try{

        
        if(req.user==null){
            res.status(401).json({
                message:"You need to logged in to view your orders"
            })
            return  
        }

        const pageNumberInString = req.params.pageNumber    //"10"
        const pageSizeInString = req.params.pageSize        //"12"

        const pageSize = parseInt(pageSizeInString)         //10
        const pageNumber = parseInt(pageNumberInString)     //12

        if(pageSize<1 || pageSize>100){
            res.status(400).json({
                message:"Page size should be between 1 and 100"
            })
            return
        }
        

        if(req.user.isAdmin){

            const orderCount= await Order.countDocuments()
            const totalPages =Math.ceil(orderCount/pageSize)             //asanna purna sankyawata watayapu eka me math.ceil function eken wenne
            const orders = await Order.find().sort({date:-1}).skip((pageNumber-1)*pageSize).limit(pageSize)
            res.status(200).json({
                orders:orders,
                totalPages:totalPages,
                total : orderCount
            })

        }else{

            const orderCount= await Order.countDocuments({email:req.user.email})
            const orders = await Order.find({email:req.user.email}).sort({date:-1}).skip((pageNumber-1)*pageSize).limit(pageSize)     
            res.status(200).json({
                orders:orders,
                totalPages: totalPages,
                total : orderCount

            })
        }
    }catch(error){
        (error)=>{
            console.log(error)
            res.status(500).json({
                message:"Error fetching orders"
            })
        }
    }
}



export async function updateOrderStatusAndNotes(req,res){
    if(req.user && req.user.isAdmin){
        try{
            const orderId = req.params.orderId
            await Order.findOneAndUpdate(
                {orderId:orderId},
                {
                    status:req.body.status,
                    notes:req.body.notes
                }
            )
            res.status(200).json({
                message:"Order status and notes updated successfully"
            })

        }catch(error){
            console.log(error)
            res.status(500).json({
                message:"Error updating order status and notes"
            })
        }
    }
}