import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
    service : "gmail",
    auth : {
      user : "ifrank44445@gmail.com",
      pass : "thee qwxq pgxk ebvm"
    }
 })

 export default transport