import Product from '../models/product.js'

export const updateProduct = async (req, res, next) => {
    const bulkOps = req.body.orderItems.map(item => {
        return {
            "updateOne" : {
                "filter": {"_id": item.product},
                "update": {"$inc": {"countInStock": - Number(item.qty)}}
            }
        }
    })
    try{
        const updatedProduct = await Product.bulkWrite(bulkOps);
        next();
    }
    catch (error){
        res.status(401).send(error);
    }
}

