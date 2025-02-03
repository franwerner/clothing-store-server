import UserQuestionsController from "@/controller/userQuestions.controller"
import isCompleteUser from "@/middleware/isCompleteUser.middleware"
import { Router } from "express"

const userQuestionsRouter = Router()

userQuestionsRouter.post("/", isCompleteUser, UserQuestionsController.create)
userQuestionsRouter.post("/guest", UserQuestionsController.createGuest)

export default userQuestionsRouter