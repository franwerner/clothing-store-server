import { User } from "../model/users.model.js"

type FormatUser = Omit<User, "password" | "ip" | "create_at">

export default FormatUser