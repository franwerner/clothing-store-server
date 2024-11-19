import express from "express"
import UserRegisterController from "../controller/userRegister.controller.js"
import isUser from "../middleware/isUser.middleware.js"
import isNotConfirmedEmail from "../middleware/isNotConfirmedEmail.middleware.js"

const userRegisterRouter = express.Router()

userRegisterRouter.post("/", UserRegisterController.register)
userRegisterRouter.get("/confirmation/:token", UserRegisterController.confirmRegistration)
userRegisterRouter.get("/send/token", isUser, isNotConfirmedEmail, UserRegisterController.sendRegisterToken )

export default userRegisterRouter