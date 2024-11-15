import express from "express"
import UserController from "../controller/users.controller.js"
import isUser from "../middleware/isUser.middleware.js"
import isConfirmedEmail from "../middleware/isConfirmedEmail.middleware.js"

const usersRouter = express.Router()

usersRouter.post("/register", UserController.register)
usersRouter.post("/login", UserController.login)
usersRouter.get("/logout", UserController.logout)
usersRouter.get("/register/confirmation/:token", UserController.registerConfirm)
usersRouter.get("/register/reSendToken", isUser, isConfirmedEmail, UserController.registerReSendToken)

export default usersRouter