
interface ENV {
    EMAIL: string
    EMAIL_PASSWORD: string
    FROTEND_DOMAIN: string
    BACKEND_DOMAIN: string
    PORT: number
    DB: string
    DB_HOST: string
    DB_USER: string
    DB_PASSWORD: string
    DB_PORT: number
    NODE_ENV : "dev" | "prod"
}
/**
 * Accedemos de forma segura a los ENV declarados.
 * Ya que si cambiamos algun nombre o lo indicamos mal TS lo detectara en compilacion.
 */

const _env =  process.env as unknown as ENV

export default _env