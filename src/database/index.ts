import knex from "knex"

const sql = knex({
   client: "mysql2",
   connection: {
      host: "127.0.0.1",
      user: "root",
      port: 3306,
      password: "carlos15",
      database: "chothingstore",
   },
   pool: {
      min: 1,
      max: 10,
      createTimeoutMillis: 3000,
      idleTimeoutMillis: 30000,
   }
})
export default sql