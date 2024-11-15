
import cors from "cors"
import _env from "../constant/_env.constant.js"
const corsConfig = cors({
    origin: _env.FROTEND_DOMAIN
})


export default corsConfig