import userModel from "../../DB/model/User.model.js";
import { verifyToken } from "../utils/GenerateAndVerifyToken.js";
import { asyncHandler } from "../utils/errorHandling.js";

export const roles ={
    Admin:"Admin",
    User:"User"
}

export const auth = (accessRoles = []) => {
    return asyncHandler(async (req, res, next) => {
        const { authorization } = req.headers;
        if (!authorization?.startsWith(process.env.BEARER_KEY)) {
            return next(new Error(`In-valid Bearer Key`, { cause: 400 }))
        }

        const token = authorization.split(process.env.BEARER_KEY)[1]

        if (!token) {
            return next(new Error(`In-valid Token`, { cause: 400 }))
        }

        const decoded = verifyToken({ token })
        
        if (!decoded?.id) {
            return next(new Error(`In-valid Token Payload`, { cause: 400 }))
        }
        const user = await userModel.findById(decoded.id).select("userName image role changePasswordTime password ")
        if (!user) {
            return next(new Error(`Not Register Account`, { cause: 401 }))
        }
        // console.log({changePasswordTime:parseInt(  user.changePasswordTime?.getTime()/ 1000) , tokeniat :decoded.iat});
        if(parseInt(  user.changePasswordTime?.getTime()/ 1000) > decoded.iat){
            return next(new Error(`Expired Token`, { cause: 400 }))
        }

        if(!accessRoles.includes(user.role)){
            return next(new Error(`Not authorized Account`, { cause: 403 }))
        }

        req.user = user;
        
        return next()
    })
}

