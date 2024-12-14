import transport from "../../config/nodemailer.config.js";
import _env from "../../constant/_env.constant.js";
import { EmailService } from "./index.js";

const sendPasswordReset = async ({ to, token }: EmailService) => {

    const url = `${_env.FROTEND_DOMAIN}/token?token=${token}&token_request=password_reset_by_email&email=${to}`

    return await transport.sendMail({
        from: "Olga Hat's <olgahats@noreply.com>",
        to,
        subject: "Cambio de contraseña",
        html: `
        <p>Recibimos una solicitud para cambiar tu contraseña. Si fuiste tú, por favor haz clic en el siguiente enlace para proceder con el cambio:</p>
        <a href="${url}">Cambiar mi contraseña</a>
        <p><strong>Este enlace expira en 3 horas.</strong></p>
        `,
    });
}


export default sendPasswordReset