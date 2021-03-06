import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name:           { type: String, required: true },
    image:          { type:String, required: true },
    brand:          { type: String, required: true },
    category:       { type: String, required: true },
    description:    { type: String, required: true },
    price:          { type: Number, required: true },
    countInStock:   { type: Number, required: true },
    rating:         { type: Number, required: true  },
    numReviews:     { type: Number, required: true },
    attribute: [{
        name:       { type: String, required: true },
        options:    [{type: String}]
    }],
},{
    timestamps: true,
});

const Product = mongoose.model('Product', productSchema);

export default Product;