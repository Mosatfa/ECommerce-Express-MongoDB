import subcategoryRouter from "../subcategory/subcategory.router.js"
import * as categoryContrller from "../category/controller/category.js"
import * as validators from "../category/category.validation.js"
import { auth ,roles } from "../../middleware/auth.js"
import { endpoint } from "../category/category.endPoint.js"
import { validation } from "../../middleware/validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { Router } from "express";
const router = Router()


router.use('/:categoryId/subcategory', subcategoryRouter)


router.get('/', categoryContrller.getCategory)

router.post('/', auth(endpoint.create), fileUpload(fileValidation.image).single('image'), validation(validators.createCategory), categoryContrller.createCategory)
router.put('/:categoryId', auth(endpoint.update), fileUpload(fileValidation.image).single('image'), validation(validators.updateCategory), categoryContrller.updateCategory)





export default router