import GuestQuestionsController from "@/router/guest-questions/guestQuestions.controller"
import isAdmin from "@/middleware/isAdmin.middleware"
import { Router } from "express"

const guestQuestionsRouter = Router()

guestQuestionsRouter.post("/", GuestQuestionsController.create)
guestQuestionsRouter.patch("/:guest_question_id", isAdmin, GuestQuestionsController.update)

export default guestQuestionsRouter