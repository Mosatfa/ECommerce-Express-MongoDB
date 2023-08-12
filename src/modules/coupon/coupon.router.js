import * as couponContrller from "../coupon/controller/coupon.js"
import * as validators from "../coupon/coupon.validation.js"
import { auth } from "../../middleware/auth.js"
import { validation } from "../../middleware/validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { Router } from "express";
import { endpoint } from "./coupon.endPoint.js";
const router = Router()



router.get('/', couponContrller.getCoupon)

router.post('/', auth(endpoint.create), fileUpload(fileValidation.image).single('image'), validation(validators.createCoupon), couponContrller.createCoupon)
router.put('/:couponId', auth(endpoint.update), fileUpload(fileValidation.image).single('image'), validation(validators.updateCoupon), couponContrller.updateCoupon)





export default router