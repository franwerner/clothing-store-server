import express from "express"
import UserController from "../controller/user.controller.js"

const user = express.Router()


user.post("/",UserController.post)


export default user