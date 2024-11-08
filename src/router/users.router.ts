import express from "express"
import UserController from "../controller/users.controller.js"

const usersRouter = express.Router()

usersRouter.post("/register",UserController.register)
usersRouter.post("/login",UserController.login)


export default usersRouter