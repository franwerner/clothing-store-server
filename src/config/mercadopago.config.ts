import { MercadoPagoConfig } from "mercadopago";
import _env from "../constant/_env.constant";


const mercadoPagoConfig = new MercadoPagoConfig({
  accessToken: _env.MP_ACCESS_TOKEN,
})


export default mercadoPagoConfig