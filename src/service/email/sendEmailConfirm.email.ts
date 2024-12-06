import transport from "../../config/nodemailer.config.js"
import { EmailService } from "./index.js";

const sendEmailConfirm = async ({to,token}:EmailService) => {
    return
    const url = `http://localhost:3000/users/register/confirmation/${token}`
    return await transport.sendMail({
        from: "Olga Hat's <olgahats@noreply.com>", 
        to,
        subject: "Verificación de correo electrónico",
        html: `
            <p>Por favor, haz clic en el siguiente enlace para confirmar el correo electronico.</p>
            <a href="${url}">Confirmar correo electronico.</a>
            <p><strong>Este enlace expira en 24 horas.</strong></p>
        `,
    });
}

export default sendEmailConfirm
