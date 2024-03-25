//Password Crypto
const { createHmac } = require('node:crypto')
//File and directory
const Path = require('path')

const config = {
  client: 'better-sqlite3',
  connection: {
    filename: Path.join(__dirname, __dirname.includes('app.asar') ? '../../database' : '/database'),
  },
  useNullAsDefault: true,
  migrations: {
    tableName: 'migrations',
    directory: Path.join(__dirname, '/migrations'),
  },
}
const DataBase = require('knex')(config)

//Verificar ou Criar Database
const startDataBase = async () => {
  try {
    await DataBase('migrations')
  } catch (error) {
    await DataBase.migrate.latest()
    await DataBase('users').insert({ username: 'root', active: 1 })
    const passwdAdm = createHmac('sha256', process.env.appKey).update('Admin@123').digest('hex')
    await DataBase('users').insert({ username: 'admin', password: passwdAdm, active: 1 })
    const passwdUser = createHmac('sha256', process.env.appKey).update('123456').digest('hex')
    await DataBase('users').insert({ username: 'user', password: passwdUser })
  }
}
startDataBase()

module.exports = DataBase
