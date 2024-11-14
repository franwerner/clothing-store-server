import nodemailer from "nodemailer"
import _env from "../constant/_env.constant.js"

const transport = nodemailer.createTransport({
    service : "gmail",
    auth : {
      user : _env.EMAIL,
      pass : _env.EMAIL_PASSWORD
    }
 })

 export default transport