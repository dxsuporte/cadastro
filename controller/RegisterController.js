//Requires
const Path = require('path')
const DataBase = require(Path.join(process.env.BASE_URL, 'database/connection'))
const DataTable = 'registers'

module.exports = new (class RegisterController {
  async index() {
    const result = await DataBase(DataTable).orderBy('id', 'desc')
    return result
  }

  async edit(obj) {
    const result = await DataBase(DataTable).where({ id: obj }).first()
    return result
  }

  async create(obj) {
    await DataBase(DataTable).insert({ ...obj })
  }

  async update(obj) {
    await DataBase(DataTable)
      .update({ ...obj })
      .where({ id: obj.id })
  }

  async destroy(obj) {
    await DataBase(DataTable).del().where({ id: obj })
  }
})()
