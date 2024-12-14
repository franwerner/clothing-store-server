import express from "express"
import UserController from "../controller/users.controller.js"

const usersRouter = express.Router()

usersRouter.post("/login", UserController.login)
usersRouter.get("/logout",UserController.logout)

export default usersRouter