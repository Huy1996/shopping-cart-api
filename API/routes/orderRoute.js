import express              from 'express';
import { isAdmin, isAuth }  from '../middleware/middleware.js';
import * as orderController from '../controllers/orderController.js'
import { updateProduct }    from "../middleware/helper.js";

const orderRoute = express.Router();

// Get Request Section
orderRoute.get('/',             isAuth,     isAdmin,        orderController.getAllOrders);
orderRoute.get('/summary',      isAuth,     isAdmin,        orderController.getSummary);
orderRoute.get('/mine',         isAuth,                     orderController.getPersonalOrder);
orderRoute.get('/:id',          isAuth,                     orderController.getOrderByID);


// Post Request Section
orderRoute.post('/',            isAuth,     updateProduct,  orderController.createOrder);


// Put Request Section
orderRoute.put('/:id/pay',      isAuth,                     orderController.payForOrder);
orderRoute.put('/:id/deliver',  isAuth,                     orderController.orderDelivered);


// Delete Request Section
orderRoute.delete('/:id',       isAuth,                     orderController.deleteOrder)

export default orderRoute;