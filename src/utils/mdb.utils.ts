import crypto from "crypto"

type Token = `${string}-${string}-${string}-${string}-${string}`

interface Database<T = any> {
    expiration: number, //Mileseconds
    data: T
}

class MemoryDataBase {
    database: Map<Token, Database>
    constructor() {
        this.database = new Map()
    }

    set(props: Database) {
        const uuid = crypto.randomUUID()
        this.database.set(uuid, {
            ...props,
            expiration: Date.now() + props.expiration
        })
    }

    delete(token: Token) {
        this.delete(token)
    }

    isExpiredToken(token: Token) {
        const entry = this.database.get(token)
        return entry && entry.expiration < Date.now()
    }

    get(token: Token) {
        const entry = this.database.get(token)
        if (!entry) return
        else if (this.isExpiredToken(token)) {
            this.delete(token)
            return
        }
        return entry
    }


    cleanUpExpired() {
        const cleanTime = 60 * 1000 * 60 //1 hour
        setInterval(() => {
            const entries = this.database.entries()
            for (const [token] of entries) {
                const isExpired = this.isExpiredToken(token)
                if (isExpired) this.delete(token)
            }
        }, cleanTime)
    }

}


//Unica instancia
export default new MemoryDataBase