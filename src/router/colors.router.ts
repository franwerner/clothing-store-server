import express from "express"
import ColorsController from "../controller/colors.controller.js"

const colorsRouter = express.Router()

colorsRouter.get("/", ColorsController.getColors)
colorsRouter.delete("/", ColorsController.removeColors)
colorsRouter.patch("/", ColorsController.modifyColor)
colorsRouter.post("/", ColorsController.setColor)

export default colorsRouter