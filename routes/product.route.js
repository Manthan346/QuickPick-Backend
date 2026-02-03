import express from 'express'
import { listProducts, addProducts, productInfo, deleteSingleProduct,updateProduct } from '../controllers/products.controllers.js'
import { upload } from '../middlewares/multer.middleware.js'

import {adminAuth} from '../middlewares/admin.middleware.js'
import { pagination } from '../middlewares/pagination.middleware.js'

const productRouter = express.Router()

productRouter.post('/addproduct',adminAuth, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
]),
    addProducts)
productRouter.delete('/deleteproduct/:productId', deleteSingleProduct)
productRouter.get('/listproducts', pagination, listProducts)
productRouter.get('/productinfo', productInfo)
productRouter.put('/editproduct/:productId',adminAuth, upload.fields([
    { name: 'image1', maxCount: 1 },
    { name: 'image2', maxCount: 1 },
    { name: 'image3', maxCount: 1 },
    { name: 'image4', maxCount: 1 }
  ]),updateProduct)

export default productRouter 
