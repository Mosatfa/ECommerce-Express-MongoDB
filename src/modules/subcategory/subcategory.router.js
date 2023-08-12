import * as subcategoryContrller from "../subcategory/controller/subcategory.js"
import * as validators from "../subcategory/subcategory.validation.js"
import { auth, roles } from "../../middleware/auth.js"
import { endPoint } from "./subcategory.endPoint.js";
import { validation } from "../../middleware/validation.js"
import { fileUpload, fileValidation } from "../../utils/multer.js";
import { Router } from "express";
const router = Router({ mergeParams: true })



router.get('/', auth(Object.values(roles)), subcategoryContrller.getSubcategory)

router.post('/', auth(endPoint.create), fileUpload(fileValidation.image).single('image'), validation(validators.createsubcategory), subcategoryContrller.createSubcategory)
router.put('/:subcategoryId', auth(endPoint.update), fileUpload(fileValidation.image).single('image'), validation(validators.updatesubcategory), subcategoryContrller.updateSubcategory)





export default router