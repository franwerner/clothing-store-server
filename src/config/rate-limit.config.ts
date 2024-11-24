import {rateLimit} from "express-rate-limit"


const limiter = rateLimit({
     windowMs : 5 * 60 * 1000, //5 minutos 
     limit : 150,
     message : "Demasiadas solicitudes, por favor intenta de nuevo en 10 minutos."
})


export default limiter