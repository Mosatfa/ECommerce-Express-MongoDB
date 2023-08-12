import * as prodcutContrller from "../product/controller/product.js"
import reviewRouter from "../reviews/reviews.router.js"
import * as validators from "../product/product.validation.js"
import { auth } from "../../middleware/auth.js"
import { endpoint } from "./product.endPoint.js";
import { validation } from "../../middleware/validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { Router } from "express";
const router = Router()



router.use('/:productId/review' , reviewRouter)

router.get('/', prodcutContrller.getProduct)

router.post('/', auth(endpoint.create),fileUpload(fileValidation.image).fields([{name:"mainImage" , maxCount:1 },{name:"subImages" , maxCount:5 },]), validation(validators.createProduct),prodcutContrller.createProduct)
router.put('/:productId', auth(endpoint.update),fileUpload(fileValidation.image).fields([{name:"mainImage" , maxCount:1 },{name:"subImages" , maxCount:5 },]), validation(validators.updateProduct),prodcutContrller.updateProduct)

router.patch('/:productId/wishList', auth(endpoint.addlist), validation(validators.addWishlist),prodcutContrller.addWishList)
router.patch('/:productId/wishList/remove', auth(endpoint.addlist), validation(validators.addWishlist),prodcutContrller.removeWishList)






export default router