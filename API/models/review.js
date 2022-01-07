import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
    _id: mongoose.Types.ObjectId,
    userID: {
        type:       mongoose.Schema.Types.ObjectId,
        ref:        'User',
        required:   true
    },
    productID: {
        type:       mongoose.Schema.Types.ObjectId,
        ref:        'Product',
        required:   true
    },
    comment:{
        type: String,
        required: true,
    },
    rating:{
        type: Number,
        required: true,
    }
},{
    timestamps: true,
});


const Review = mongoose.model('Review', reviewSchema);

export default Review;