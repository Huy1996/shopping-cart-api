import mongoose from 'mongoose';

const cartSchema = mongoose.Schema({
    _id:            mongoose.Types.ObjectId,
    customerID: {
        type:       mongoose.Types.ObjectId,
        required:   true
    },
    itemList: [{
        productID: {
            type:       mongoose.Schema.Types.ObjectId,
            ref:        'Product',
        },
        quantity: {
            type:       Number,
            default:    1
        }
    }]
});

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;