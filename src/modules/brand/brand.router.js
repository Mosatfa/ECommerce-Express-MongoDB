import * as brandContrller from "../brand/controller/brand.js"
import * as validators from "../brand/brand.validation.js"
import { auth, roles } from "../../middleware/auth.js"
import { endpoint } from "./brand.endPoint.js"
import { validation } from "../../middleware/validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { Router } from "express";
const router = Router()




router.get('/', auth(Object.values(roles)), brandContrller.getBrand)

router.post('/', auth(endpoint.create), fileUpload(fileValidation.image).single('logo'), validation(validators.createBrand), brandContrller.createBrand)
router.put('/:brandId', auth(endpoint.update), fileUpload(fileValidation.image).single('logo'), validation(validators.updateBrand), brandContrller.updateBrand)





export default router