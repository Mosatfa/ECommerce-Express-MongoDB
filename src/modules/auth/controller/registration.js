import userModel from "../../../../DB/model/User.model.js";
import optModel from "../../../../DB/model/Opt.model.js";
import sendEmail from "../../../utils/email.js";
import { generateToken, verifyToken } from "../../../utils/GenerateAndVerifyToken.js";
import { hash, compare } from "../../../utils/HashAndCompare.js";
import { asyncHandler } from "../../../utils/errorHandling.js";


export const signUp = asyncHandler(async (req, res, next) => {
    const { userName, email, password } = req.body;
    if (await userModel.findOne({ email: email.toLowerCase() })) {
        return next(new Error(`Email already Exist`, { cause: 409 }))
    };

    const token = generateToken({ payload: { email }, signature: process.env.TOKEN_EMAIL })
    const refreshToken = generateToken({ payload: { email }, signature: process.env.TOKEN_EMAIL, expiresIn: 60 * 60 * 24 })

    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`
    const rfLink = `${req.protocol}://${req.headers.host}/auth/newConfirmEmail/${refreshToken}`

    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Document</title>
        <style>
            .text-center{
                text-align: center;
            }
            a {
                color: white;
                text-decoration: none;
            }
            button {
                background-color: #4CAF50; /* Green */
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
            }
        </style>
    </head>
    <body>
        <h1>Click To Confirm Email:</h1>
        <div class="text-center">
            <div>
                <button><a href="${link}">Verify Email Address</a></button>
            </div>
            <br>
            <div>
                <button><a href="${rfLink}">Requset New Email</a></button>
            </div>
        </div>
    </body>
    </html>`
    if (! await sendEmail({ to: email, subject: "Confrim Email", html })) {
        return next(new Error(`Email Rejected`, { cause: 400 }))
    }

    const hashPassword = hash({ plaintext: password })

    const { _id } = await userModel.create({ userName, email, password: hashPassword })
    return res.status(201).json({ message: "Done", _id })
})

export const confirmEmail = asyncHandler(async (req, res, next) => {

    const { token } = req.params
    const { email } = verifyToken({ token, signature: process.env.TOKEN_EMAIL })
    if (!email) {
        return next(new Error(`In-Valid Token Payload`, { cause: 400 }))
    }

    const user = await userModel.updateOne({ email }, { confirmEmail: true })

    return user.matchedCount ? res.status(200).redirect(`${process.env.FT_URL}`) :  next(new Error("Not Register Account" , {cause:400}))

})


export const RequsetNewConfirmEmail = asyncHandler(async (req, res, next) => {

    const { token } = req.params
    const { email } = verifyToken({ token, signature: process.env.TOKEN_EMAIL })
    if (!email) {
        return next(new Error(`In-Valid Token Payload`, { cause: 400 }))
    }

    const user = await userModel.findOne({ email })
    if (!user) {
        return next(new Error(`Not Register Account`, { cause: 404 }))
    }
    if (user.confirmEmail) {
        return res.status(200).redirect(`${process.env.FT_URL}`)
    }

    const newtoken = generateToken({ payload: { email }, signature: process.env.TOKEN_EMAIL, expiresIn: 60 * 5 })


    const link = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${newtoken}`
    const rfLink = `${req.protocol}://${req.headers.host}/auth/confirmEmail/${token}`

    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
        <title>Document</title>
        <style>
            .text-center{
                text-align: center;
            }
            a {
                color: white;
                text-decoration: none;
            }
            button {
                background-color: #4CAF50; /* Green */
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
            }
        </style>
    </head>
    <body>
        <h1>Click To Confirm Email:</h1>
        <div class="text-center">
            <div>
                <button><a href="${link}">Verify Email Address</a></button>
            </div>
            <br>
            <div>
                <button><a href="${rfLink}">Requset New Email</a></button>
            </div>
        </div>
    </body>
    </html>`
    if (! await sendEmail({ to: email, subject: "Confrim Email", html })) {
        return next(new Error(`Email Rejected`, { cause: 400 }))
    }

    return res.status(200).send(`<p>Please check your email </p>`)
})


export const logIn = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() })
    if (!user) {
        return next(new Error(`Not Register Account`, { cause: 404 }))
    };

    if (!user.confirmEmail) {
        return next(new Error(`please confrim your email frist`, { cause: 400 }))
    };

    if (!compare({ plaintext: password, hashValue: user.password })) {
        return next(new Error(`In-Valid login data`, { cause: 409 }))
    }

    const access_token = generateToken({ payload: { id: user._id, role: user.role }, expiresIn: 60 * 30 })
    const refresh_token = generateToken({ payload: { id: user._id, role: user.role }, expiresIn: 60 * 60 * 24 * 365 })

    user.status = "Online"
    user.save()

    return res.status(200).json({ message: "Done", access_token, refresh_token })
})


export const sendCode = asyncHandler(async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email: email.toLowerCase() });
    if (!user) {
        return next(new Error("In-Valid Email", { cause: 400 }));
    };
    const code = Math.floor(1000 + Math.random() * 9000)
    const response = await optModel.create({
        email,
        code,
        expireIn: new Date().getTime() + 300 * 1000
    });
    const html = `<h1>Code:${code}</h1>`;
    await sendEmail({ to: email, subject: "Reset password", html });
    return res.status(201).json({ message: "Success", code: response.code });
});


export const forgetPassword = asyncHandler(async (req, res, next) => {
    const { code, newPassword } = req.body;

    const check = await optModel.findOne({ code })
    if (!check) {
        return next(new Error("In-Valid Code", { cause: 400 }));
    }
    const currentTime = new Date().getTime()
    if (check.expireIn - currentTime < 0) {
        return next(new Error("The code is expired", { cause: 400 }));
    }
    const hashPassword = hash({ plaintext: newPassword })
    const user = await userModel.findOneAndUpdate({ email: check.email }, { password: hashPassword });
    user.changePasswordTime = Date.now()
    await user.save()
    await optModel.findByIdAndDelete(check._id)
    return res.status(200).json({ message: "Done" });
});


export const changePassword = asyncHandler(async (req, res, next) => {
    const { oldPassword, newPassword } = req.body;
    console.log({ user: req.user.password });
    const match = compare({ plaintext: oldPassword, hashValue: req.user.password });
    if (!match) {
        return next(new Error("In-Valid Password", { cause: 400 }));
    };
    const hashPassword = hash({ plaintext: newPassword });
    await userModel.findByIdAndUpdate(req.user._id, { password: hashPassword });
    return res.status(200).json({ message: "Done" })
});