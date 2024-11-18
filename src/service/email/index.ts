import sendPasswordUpate from "./sendPasswordUpdate.email.js"
import sendRegisterConfirm from "./sendRegisterConfirm.email.js"

interface EmailService{
    email : string,
    token : string
   }


const emailService = {
    sendRegisterConfirm,
    sendPasswordUpate
}

export {type EmailService}
export default emailService