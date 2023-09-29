import knex from 'knex'

const sqliteConfig = {
  client: 'better-sqlite3',
  connection: {
    filename: "C:/Users/elias/Projetos/PPS/express_session/database/db.db",
    database: 'db'
  },
  useNullAsDefault: true
}

export const knexInstance = knex(sqliteConfig) 