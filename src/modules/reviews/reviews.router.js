import * as reviewController from "../reviews/controller/review.js"
import * as validators from "../reviews/reviews.validation.js"
import { validation } from "../../middleware/validation.js"
import {auth} from "../../middleware/auth.js"
import { endpoint } from "./reviews.endPoint.js";
import { Router } from "express";
const router = Router({ mergeParams: true })


router.post('/' , auth(endpoint.create), validation(validators.createReview),reviewController.createReview)
router.patch('/:reviewId' , auth(endpoint.update), validation(validators.updateReview),reviewController.updateReview)









export default router