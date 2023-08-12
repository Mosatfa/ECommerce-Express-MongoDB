import * as cartController from "../cart/controller/cart.js"
import * as validators from "../cart/cart.validation.js"
import { auth, roles } from "../../middleware/auth.js"
import { endPoint } from "./cart.endPoint.js";
import {validation} from "../../middleware/validation.js"
import { Router } from "express";
;
const router = Router()




router.post('/', auth(endPoint.User), validation(validators.createCart), cartController.createCart)
router.patch('/remove', auth(endPoint.User), validation(validators.deleteItemCart), cartController.deleteItem)
router.patch('/clear', auth(endPoint.User), validation(validators.deleteItemCart), cartController.clearCart)






export default router