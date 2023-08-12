import * as authController from "../auth/controller/registration.js"
import * as validitors from "./auth.validation.js"
import { validation } from "../../middleware/validation.js";
import { auth ,roles } from "../../middleware/auth.js"

import { Router } from "express";
const router = Router()

router.post('/signup',validation(validitors.signUp),authController.signUp)
router.get('/confirmEmail/:token',validation(validitors.token),authController.confirmEmail)
router.get('/newConfirmEmail/:token',validation(validitors.token),authController.RequsetNewConfirmEmail)
router.post('/login',validation(validitors.login),authController.logIn)
router.patch('/sendCode' , validation(validitors.sendCode), authController.sendCode)
router.patch('/forgetPassword',validation(validitors.forgetPssword), authController.forgetPassword )
router.patch('/changePassword', auth(Object.values(roles)),validation(validitors.changePassword), authController.changePassword)



export default router