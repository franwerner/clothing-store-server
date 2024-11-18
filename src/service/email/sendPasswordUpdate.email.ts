import transport from "../../config/nodemailer.config.js";
import { EmailService } from "./index.js";
interface sendPasswordUpate extends EmailService { }

const sendPasswordUpate = async ({ email, token }: sendPasswordUpate) => {

    const url = `http://localhost:3000/users/password/update/${token}`

    return await transport.sendMail({
        from: "Olga Hat's <olgahats@noreply.com>",
        to: email,
        subject: "Cambio de contraseña",
        html: `
        <p>Recibimos una solicitud para cambiar tu contraseña. Si fuiste tú, por favor haz clic en el siguiente enlace para proceder con el cambio:</p>
        <a href=${url}>Cambiar mi contraseña</a>
        <p><strong>Este enlace expira en 24 horas.</strong></p>
        `,
    });
}


export default sendPasswordUpate