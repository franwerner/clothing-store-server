import express from "express"
import isAdmin from "@/middleware/isAdmin.middleware.js"
import ColorsController from "./colors.controller"

const colorsRouter = express.Router()

colorsRouter.get("/", ColorsController.getColors)
colorsRouter.delete("/", isAdmin, ColorsController.removeColors)
colorsRouter.patch("/", isAdmin, ColorsController.modifyColors)
colorsRouter.post("/", isAdmin, ColorsController.addColors)

export default colorsRouter