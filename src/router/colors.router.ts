import express from "express"
import ColorsController from "../controller/colors.controller.js"
import isAdmin from "../middleware/isAdmin.middleware.js"

const colorsRouter = express.Router()

colorsRouter.get("/", ColorsController.getColors)
colorsRouter.delete("/", isAdmin, ColorsController.removeColors)
colorsRouter.patch("/", isAdmin, ColorsController.modifyColor)
colorsRouter.post("/", isAdmin, ColorsController.setColor)

export default colorsRouter