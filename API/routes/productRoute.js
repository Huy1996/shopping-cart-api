import express from 'express';
import { isAdmin, isAuth } from '../middleware/middleware.js';
import * as productController from '../controllers/productController.js' ;
import {clearReview} from "../middleware/helper.js";

const productRoute = express.Router();

// Get Request Section
productRoute.get('/',                                             productController.getAllProduct);
productRoute.get('/categories',                                   productController.getAllCategories);
productRoute.get('/brands',                                       productController.getAllBrands);
productRoute.get('/:id',                                          productController.getProductByID);


// Post Request Section
productRoute.post('/',              isAuth, isAdmin,              productController.createProduct);
productRoute.post('/:id/reviews',   isAuth,                       productController.userReview);

// Put Request Section
productRoute.put('/:id',            isAuth, isAdmin,              productController.updateProduct);


// Delete Request Section
productRoute.delete('/:id',         isAuth, isAdmin, clearReview, productController.deleteProduct);


export default productRoute;