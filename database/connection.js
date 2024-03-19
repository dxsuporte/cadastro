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
  seeds: {
    directory: Path.join(__dirname, '/seeds'),
  },
}
module.exports = require('knex')(config)
