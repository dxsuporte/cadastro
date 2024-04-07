//Requires
const { ipcRenderer } = require('electron')
const Path = require('path')
const DataBase = require(Path.join(process.env.BASE_URL, 'database/connection'))
const DataTable = 'registers'

module.exports = new (class RegisterController {
  async index() {
    const result = await DataBase(DataTable).orderBy('id', 'desc')
    return result
  }

  async edit(data) {
    const result = await DataBase(DataTable)
      .where({ ...data })
      .first()
    return result
  }

  async store(data) {
    if (!data.name || !data.surname) {
      const msg = { title: 'Error!', body: 'Nome e sobrenome não pode ser nulo!' }
      await ipcRenderer.invoke('msg', msg)
    } else {
      await DataBase(DataTable).insert({ ...data })
    }
  }

  async update(data) {
    if (!data.name || !data.surname) {
      const msg = { title: 'Error!', body: 'Nome e sobrenome não pode ser nulo!' }
      await ipcRenderer.invoke('msg', msg)
    } else {
      await DataBase(DataTable)
        .update({ ...data })
        .where({ id: data.id })
    }
  }

  async destroy(data) {
    await DataBase(DataTable)
      .del()
      .where({ ...data })
  }
})()
