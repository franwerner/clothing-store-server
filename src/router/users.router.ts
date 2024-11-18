import express from "express"
import UserController from "../controller/users.controller.js"
import isUser from "../middleware/isUser.middleware.js"

const usersRouter = express.Router()

usersRouter.post("/login", UserController.login)
usersRouter.get("/logout",isUser,UserController.logout)

export default usersRouter