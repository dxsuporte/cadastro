//Requires
const { createHmac } = require('node:crypto')
const Path = require('path')
const DataBase = require(Path.join(process.env.BASE_URL, 'database/connection'))
const DataTable = 'users'

module.exports = new (class RegisterController {
  async index() {}

  async edit() {}

  async create() {}

  async update() {}

  async destroy() {}

  async login(obj) {
    const password = createHmac('sha256', process.env.APP_KEY).update(obj.password).digest('hex')
    const result = await DataBase('users').where({ username: obj.username, password: password }).first()
    process.env.authUser = result.username
    process.env.authActive = result.active
    return result
  }
})()
