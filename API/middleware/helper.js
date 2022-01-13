import Product from '../models/product.js'
import Review from "../models/review2.js";

export const updateProduct = async (req, res, next) => {
    if(req.body.orderItems.length === 0){
        res
            .status(400)
            .send({
                message: 'Cart is empty'
            });
    }
    else {
        const bulkOps = req.body.orderItems.map(item => {
            return {
                "updateOne": {
                    "filter": {"_id": item.product},
                    "update": {"$inc": {"countInStock": -Number(item.qty)}}
                }
            }
        })
        try {
            await Product.bulkWrite(bulkOps);
            next();
        } catch (error) {
            res.status(401).send(error);
        }
    }
}

export const calculateRating = async (req, res, next) => {
    const productId = req.product;
    const reviews = await Review.find({product: productId});
    const product = await Product.findById(productId);
    product.rating = reviews.reduce((a, c) => c.rating + a, 0) / reviews.length;
    product.numReviews = reviews.length;
    await product.save();
}

export const isReviewValid = async (req, res, next) => {
    const review = await Review.find({user: req.user._id, product: req.params.id});
    if(review){
        res.status(400).send({
            message: 'You already made a comment on this product. According to our policy, each your can only make one review per product. Please consider modifying your posted review! Thank you',
        })
        return;
    }
    else{
        next();
    }
}