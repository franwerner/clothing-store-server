import bcrypt from "bcrypt"

class UserAuthService {

    static async createPassword(password:string) {
        const salt = await bcrypt.genSalt(10)
        const hash = await bcrypt.hash(password, salt)
        return hash
    }

    static async validatePassword(password:string,hash:string){
       return await bcrypt.compare(password,hash)
    }
}

export default UserAuthService