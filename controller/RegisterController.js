//Requires
const Path = require('node:path')
const DataBase = require(Path.join(process.env.BASE_URL, 'database/connection'))
const DataTable = 'registers'

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
})()
