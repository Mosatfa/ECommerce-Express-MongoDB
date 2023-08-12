import * as orderController from "../order/controller/order.js"
import * as validators from "../order/order.validation.js"
import { validation } from "../../middleware/validation.js"

import {auth} from "../../middleware/auth.js"
import { Router } from "express";
import { endpoint } from "./order.endPoint.js";
const router = Router()




router.post('/',auth(endpoint.create),validation(validators.createOrder),orderController.createOrder)
router.patch('/:orderId',auth(endpoint.cancel),validation(validators.cancelOrder),orderController.cancelOrder)
router.patch('/:orderId/admin',auth(endpoint.status),validation(validators.updateOrderStatusByAdmin),orderController.updateOrderStatusByAdmin)






export default router