import Order from '../models/order.js'
import User from '../models/user.js'
import Product from "../models/product.js";
import { mailgun, payOrderEmailTemplate } from '../middleware/middleware.js';

/*---------------------------- Get Section ----------------------------*/

export const getAllOrders = async (req, res) => {
    const pageSize      = 10;
    const page          = Number(req.query.pageNumber) || 1;
    const count         = await Order.count({})
    const orders = await Order
                            .find({})
                            .populate('user', 'name')
                            .skip(pageSize * (page - 1))
                            .limit(pageSize);
    res.send({
        orders,
        page,
        pages: Math.ceil( count/ pageSize )
    });
}

export const getSummary = async (req, res) => {
    const orders = await Order.aggregate([
        {
            $group: {
                _id: null,
                numOrders: {$sum: 1},
                totalSales: {$sum: '$totalPrice'},
            },
        },
    ]);
    const users = await User.aggregate([
        {
            $group: {
                _id: null,
                numUsers: {$sum:1},
            },
        },
    ]);
    const dailyOrders = await Order.aggregate([
        {
            $group: {
                _id: {$dateToString: {format:'%Y-%m-%d', date: '$createdAt'}},
                orders: {$sum:1},
                sales: {$sum: '$totalPrice'},
            },
        },
        { $sort: {_id:1}}
    ]);
    const productCategories = await Product.aggregate([
        {
            $group:{
                _id: '$category',
                count: {$sum:1},
            },
        },
    ]);
    res.send({users, orders, dailyOrders, productCategories});
}

export const getPersonalOrder = async (req, res) => {
    try{
        const orders = await Order.find({ user: req.user._id });
        res.send(orders);
    }
    catch (error){
        res.status(404).send(error);
    }
}

export const getUserOrder = async (req, res) => {
    try{
        const orders = await Order.find({ user: req.params.id });
        const count = await Order.count({ user: req.params.id });
        res.send({count, orders});
    }
    catch (error){
        res.status(404).send(error);
    }
}

export const getOrderByID = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(order){
        res.send(order);
    }
    else{
        res
            .status(404)
            .send({
                message: 'Order Not Found'
            });
    }
}



/*---------------------------- Post Section ----------------------------*/

export const createOrder = async (req, res) => {
    try{
        const order = new Order({
            orderItems:         req.body.orderItems,
            shippingAddress:    req.body.shippingAddress,
            paymentMethod:      req.body.paymentMethod,
            itemsPrice:         req.body.itemsPrice,
            shippingPrice:      req.body.shippingPrice,
            taxPrice:           req.body.taxPrice,
            totalPrice:         req.body.totalPrice,
            user:               req.user._id,
        });
        const createdOrder = await order.save();
        res
            .status(201)
            .send({
                message: 'New Order Created',
                order: createdOrder,
            });
    }
    catch (error){
        res.status(404).send(error);
    }

}



/*---------------------------- Put Section ----------------------------*/

export const payForOrder = async (req, res) => {
    const order = await Order.findById(req.params.id).populate('user', 'email name');
    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.email_address,
        };
        const updatedOrder = await order.save();
        try{
            mailgun().messages().send({
                from:'Shopping_Cart <seniorproject195@gmail.com>',
                to:`${order.user.name} <${order.user.email}>`,
                subject:`New order ${order._id}`,
                html: payOrderEmailTemplate(order),
            }, (error, body) => {
                if(error){
                    console.log(error);
                }
                else{
                    console.log(body);
                }
            });
        }
        catch(error){
            console.log(error)
        }

        res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
}

export const orderDelivered = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
        const updatedOrder = await order.save();
        res.send({ message: 'Order Deliverd', order: updatedOrder });
    } else {
        res.status(404).send({ message: 'Order Not Found' });
    }
}





/*---------------------------- Delete Section ----------------------------*/

export const deleteOrder = async (req, res) => {
    const order = await Order.findById(req.params.id);
    if(order){
        const deleteOrder = await order.remove();
        res.send({
            message: 'Order Deleted',
            order: deleteOrder
        });
    }
    else{
        res
            .status(404)
            .send({
                message: 'Order Not Found'
            });
    }
}