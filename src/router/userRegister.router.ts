import express from "express"
import UserRegisterController from "../controller/userRegister.controller.js"
import isConfirmedEmail from "../middleware/isConfirmedEmail.middleware.js"
import isUser from "../middleware/isUser.middleware.js"

const userRegisterRouter = express.Router()

userRegisterRouter.post("/", UserRegisterController.register)
userRegisterRouter.get("/confirmation/:token", UserRegisterController.registerConfirm)
userRegisterRouter.get("/reSendToken", isUser, isConfirmedEmail, UserRegisterController.registerReSendToken)

export default userRegisterRouter