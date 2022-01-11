import express from 'express';
import { isAdmin, isAuth } from '../middleware/middleware.js';
import * as reviewController from '../controllers/reviewController.js'
import {calculateRating} from "../middleware/helper.js";

const reviewRoute = express.Router();

// Get Request Section
reviewRoute.get('/user',           isAuth,             reviewController.getReviewFromUser);
reviewRoute.get('/product/:id',                        reviewController.getReviewFromProduct);
reviewRoute.get('/user/:id',       isAuth, isAdmin,    reviewController.getUserReview)

// Post Request Section
reviewRoute.post('/:id',           isAuth,             reviewController.createReview,           calculateRating);

// Put Request Section
reviewRoute.put('/id',             isAuth,             reviewController.updateReview)

// Delete Request Section
reviewRoute.delete('/:id',         isAuth,             reviewController.deleteReview);

export default reviewRoute;