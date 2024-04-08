//Requires
const { createHmac } = require('node:crypto')
const Path = require('node:path')
const DataBase = require(Path.join(process.env.BASE_URL, 'database/connection'))
const DataTable = 'users'

module.exports = new (class RegisterController {
  async index() {
    try {
      const result = await DataBase(DataTable).orderBy('id', 'desc')
      return result
    } catch (error) {
      console.log(error)
    }
  }

  async edit(data) {
    try {
      const result = await DataBase(DataTable)
        .where({ ...data })
        .first()
      return result
    } catch (error) {
      console.log(error)
    }
  }

  async store(data) {
    try {
      await DataBase(DataTable).insert({ ...data })
    } catch (error) {
      console.log(error)
    }
  }

  async update(data) {
    try {
      await DataBase(DataTable)
        .update({ ...data })
        .where({ id: data.id })
    } catch (error) {
      console.log(error)
    }
  }

  async destroy(data) {
    try {
      await DataBase(DataTable)
        .del()
        .where({ ...data })
    } catch (error) {
      console.log(error)
    }
  }

  async login(data) {
    try {
      const password = createHmac('sha256', process.env.APP_KEY).update(data.password).digest('hex')
      const result = await DataBase(DataTable).where({ username: data.username, password: password }).first()
      process.env.authUser = result.username
      process.env.authActive = result.active
      return result
    } catch (error) {
      console.log(error)
    }
  }
})()
