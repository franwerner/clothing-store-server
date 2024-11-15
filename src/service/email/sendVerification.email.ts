import transport from "../../config/nodemailer.config.js"

interface SendVerificationEmail{
 email : string,
 token : string
}

const sendVerification = async ({email,token}:SendVerificationEmail) => {
    return await transport.sendMail({
        from: "Olga Hat's <olgahats@noreply.com>", 
        to: email,
        subject: "Verificación de correo electrónico",
        html: `
            <p>Gracias por registrarte. Por favor, haz clic en el siguiente enlace para confirmar tu registro:</p>
            <a href="http://localhost:3000/users/register/confirmation/${token}">Confirmar mi registro</a>
            <p><strong>Este enlace expira en 24 horas.</strong></p>
        `,
    });
}


export default sendVerification