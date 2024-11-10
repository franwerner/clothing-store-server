import bcrypt from "bcrypt"
import { User } from "../model/users.model"

class UserAuthService {

    static async validatePassword(password:string,hash:string){
       return await bcrypt.compare(password,hash)
    }

    static formatUser(user:User){
        const omitPropertyPassword = Object.entries(user)
        .filter(([key]) => key !== "password" )
        return Object.fromEntries(omitPropertyPassword)
    }

}

export default UserAuthService