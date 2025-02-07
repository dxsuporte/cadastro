//Requires
const { createHmac } = require('node:crypto')
const Path = require('node:path')

//Migrations Config
const migrations = {
  tableName: 'migrations',
  directory: Path.join(__dirname, '/migrations'),
}

let config
if (process.env.DB_CONNECTION === 'mysql') {
  config = {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    },
    migrations: { ...migrations },
  }
} else {
  config = {
    client: 'sqlite3',
    connection: {
      filename: process.env.DB_FILE,
    },
    useNullAsDefault: true,
    migrations: { ...migrations },
  }
}

const DataBase = require('knex')(config)

//Verificar ou Criar Database
const startDataBase = async () => {
  try {
    await DataBase('migrations')
  } catch (error) {
    await DataBase.migrate.latest()
    await DataBase('users').insert({ username: 'root', active: 1 })
    const passwdAdm = createHmac('sha256', process.env.APP_KEY).update('Admin@123').digest('hex')
    await DataBase('users').insert({ username: 'admin', password: passwdAdm, active: 1 })
    const passwdUser = createHmac('sha256', process.env.APP_KEY).update('123456').digest('hex')
    await DataBase('users').insert({ username: 'user', password: passwdUser })
  }
}
startDataBase()

module.exports = DataBase
