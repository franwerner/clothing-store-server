import express from "express"
import UserRegisterController from "../controller/userRegister.controller.js"
import isNotCompleteUser from "../middleware/isNotCompleteUser.middleware.js"
import tokenRateLimiter from "../rate-limiter/token.rate-limiter.js"

const userRegisterRouter = express.Router()

userRegisterRouter.post("/", UserRegisterController.register)
userRegisterRouter.get("/confirmation/:token", UserRegisterController.confirmRegistration)
userRegisterRouter.get("/send/token", tokenRateLimiter,isNotCompleteUser, UserRegisterController.sendRegisterToken)

export default userRegisterRouter