import knex from "knex"
import _env from "../constant/_env.constant.js"

const { DB_HOST, DB_USER, DB_PORT, DB_PASSWORD, DB } = _env
const sql = knex({
   client: "mysql2",
   connection: {
      host: DB_HOST,
      user: DB_USER,
      port: DB_PORT,
      password: DB_PASSWORD,
      database: DB,
   },
   pool: {
      min: 1,
      max: 10,
      createTimeoutMillis: 3000,
      idleTimeoutMillis: 30000,
   }
})

export default sql