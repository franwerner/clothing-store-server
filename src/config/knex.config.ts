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
      timezone: "+00:00"
   },
   pool: {
      min: 1,
      max: 10,
      //@ts-ignore
      afterCreate: function (connection, callback) {
         //@ts-ignore
         connection.query('SET time_zone = `+00:00`', function (err) { //Nos ayuda ajustar el UTC-0 en un etorno local con otro UTC.
            callback(err, connection)
         })
      },
      createTimeoutMillis: 3000,  // Tiempo máximo para crear una nueva conexión (en milisegundos)
      acquireTimeoutMillis: 5000, // Tiempo máximo que se espera para obtener una conexión del pool (en milisegundos)
      idleTimeoutMillis: 30000,  // Tiempo máximo en milisegundos que una conexión puede estar inactiva antes de ser destruida
      reapIntervalMillis: 1000,  // Intervalo en milisegundos para revisar conexiones inactivas,

   }
})

export default sql