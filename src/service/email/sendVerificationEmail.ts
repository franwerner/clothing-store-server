import transport from "../../config/nodemailer.config.js"

interface SendVerificationEmail{
 email : string,
 token : string
}

const sendVerificationEmail = async ({email,token}:SendVerificationEmail) => {
    return await transport.sendMail({
        from: "Olga Hat's <ifrank44445@gmail.com>", 
        to: email,
        subject: "Verificación de correo electrónico",
        html: `
            <p>Gracias por registrarte. Por favor, haz clic en el siguiente enlace para confirmar tu registro:</p>
            <a href="http://localhost:3000/register/confirmation/${token}">Confirmar mi registro</a>
        `,
    });
}


export default sendVerificationEmail