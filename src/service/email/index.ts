import sendPasswordReset from "./sendPasswordReset.email.js"
import sendEmailConfirm from "./sendEmailConfirm.email.js"

interface EmailService {
    to: string,
    token: string
}


const emailService = {
    sendEmailConfirm,
    sendPasswordReset,
}

export { type EmailService }
export default emailService