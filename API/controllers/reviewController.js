import Review from '../models/review2.js'
import mongoose from "mongoose";


/*---------------------------- Get Section ----------------------------*/

export const getReviewFromUser = async (req, res) => {
    try{
        const reviews = await Review.find({user: req.user._id}).populate('product');
        res.send(reviews);
    }
    catch (error){
        res.send(error);
    }
}


export const getReviewFromProduct = async (req, res) => {
    try{
        const reviews = await Review.find({product: req.params.id}).populate('user', 'name');
        res.status(200).send(reviews);
    }
    catch (error){
        res.status(404).send(error);
    }
}

// Admin
export const getUserReview = async (req, res) => {
    try{
        const reviews = await Review.find({user: req.params.id}).populate('user').populate('product');
        res.status(200).send(reviews);
    }
    catch (error){
        res.status(404).send(error);
    }
}


/*---------------------------- Post Section ----------------------------*/

export const createReview = async (req, res, next) => {
    const user      = req.user._id;
    const product   = req.params.id;
    try{
        const review = new Review({
            _id:        new mongoose.Types.ObjectId(),
            user:       user,
            product:    product,
            rating:       req.body.rating,
            comment:    req.body.comment
        });
        const createdReview = await review.save();
        res.status(201).send(createdReview);
        req.product = createdReview.product;
        next();
    }
    catch (error){
        res.status(404).send(error);
    }
}



/*---------------------------- Put Section ----------------------------*/

export const updateReview = async (req, res, next) => {
    try{
        const review = await Review.findById(req.params.id);
        if(review && review.user.toString() === req.user._id) {
            review.rating = req.body.rating || review.rating;
            review.comment = req.body.comment || review.comment;
            const updatedReview = await review.save();
            res.status(200).send(updatedReview);
            req.product = updatedReview.product;
            next();
        }
        else{
            res.status(400).send({
                message: 'Unauthorized action'
            })
            return;
        }
    }
    catch (error){
        res.status(404).send(error);
    }
}





/*---------------------------- Delete Section ----------------------------*/

export const deleteReview = async (req, res, next) => {
    const userId      = req.user._id;
    try{
        const review = await Review.findById(req.params.id);
        req.product = review.product;
        if(review.user.toString() === userId || req.user.isAdmin){
            const deletedReview = review.remove();
            res.status(200).send(deletedReview);
            next();
        }
        else{
            res.status(403).json({
                error: "Unauthorized to delete this review"
            })
        }
    }
    catch (error){
        res.status(400).send(error)
    }
}