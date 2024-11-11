import crypto from "crypto";
import UserTokensModel, { ExpiredConfig, RequestType } from "../model/userTokens.model.js";
import ErrorHandler from "../utils/ErrorHandler.utilts.js";

class UserTokenService {

    static async createToken(props: { ip: string, request: RequestType, user_fk: number }, expiredConfig: ExpiredConfig) {
        
        const token = crypto.randomUUID()
        
        const res = await UserTokensModel.insert({
            ...props,
            token,
        },
            expiredConfig
        )

        if(res.length == 0){
            throw new ErrorHandler({
                status : 429,
                message : "Se ha excedido el límite de solicitudes de generación de tokens para este usuario en el día."
            })
            
        }

        return token
    }

    static async selectToken() {

    }

}


export default UserTokenService