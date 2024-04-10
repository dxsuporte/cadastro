//Requires
const Path = require('node:path')
const Fs = require('fs')

module.exports = new (class myStart {
  async start() {
    try {
      let DB_FILE_CONFIG = 'database/db-config.json'
      let DB_FILE = 'database/database.sql'

      if (__dirname.includes('app.asar')) {
        const ASAR_FILE = `${process.env.HOME}/.${process.argv0}/`
        if (!Fs.existsSync(ASAR_FILE)) Fs.mkdirSync(ASAR_FILE, { recursive: true })
        DB_FILE_CONFIG = `../../../../../${ASAR_FILE}db-config.json`
        DB_FILE = `../../../../../../${ASAR_FILE}database.sql`
      }

      if (!Fs.existsSync(DB_FILE_CONFIG)) {
        Fs.writeFileSync(DB_FILE_CONFIG, JSON.stringify({ DB_CONNECTION: '', DB_NAME: '', DB_USER: '', DB_PASSWORD: '' }))
      }

      //Config variable ENV
      const DataBase = require(Path.join(__dirname, DB_FILE_CONFIG))
      process.env.DB_CONNECTION = DataBase.DB_CONNECTION
      process.env.DB_NAME = DataBase.DB_NAME
      process.env.DB_USER = DataBase.DB_USER
      process.env.DB_PASSWORD = DataBase.DB_PASSWORD
      process.env.APP_KEY = '7tHZV-E2iyWajI9vu1m4MKF8-r5GVxIE'
      process.env.DB_FILE = Path.join(__dirname, DB_FILE)
      //File Default
      process.env.BASE_URL = Path.join(__dirname)

      //Global variables
      const myGlobal = {
        TITLE: 'Cadastro Básico',
        AUTHOR: 'DX Suporte',
        EMAIL: 'dxsuporteti@gmail.com',
        PASSWORD: { name: 'Senha', icon: " <i class='bi bi-key-fill'></i> " },
        SAVE: { name: 'Salvar', icon: " <i class='bi bi-check-circle-fill'></i> " },
        CANCEL: { name: 'Cancelar', icon: " <i class='bi bi-x-octagon-fill'></i> " },
        EDIT: { name: 'Editar', icon: " <i class='bi bi-pencil-square'></i> " },
        DELETE: { name: 'Deletar', icon: " <i class='bi bi-trash-fill'></i> " },
        SEARCH: { name: 'Buscar', icon: " <i class='bi bi-search'></i> " },
        TABLE: { name: 'Tabela', icon: " <i class='bi bi-table'></i> " },
        LOGIN: { name: 'Login', icon: " <i class='bi bi-box-arrow-right'></i> " },
        HOME: { id: 'home', name: 'Home', icon: " <i class='bi bi-house-fill'></i> " },
        USER: { id: 'user', name: 'Usuário', icon: " <i class='bi bi-person-circle'></i> " },
        REGISTER: { id: 'register', name: 'Registro', icon: " <i class='bi bi-people'></i> " },
        REGISTERS: {
          name: 'Gerenciar registros',
          list: 'Lista de registros',
          inp1: 'Especialidade',
          inp2: 'Atuação',
          inp3: 'Nome',
          inp4: 'Andar',
          inp5: 'Telefone',
          inp6: 'Observação',
        },
        USERS: {
          name: 'Gerenciar usuários',
          list: 'Lista de usuários',
          inp1: 'Nome',
          inp2: 'Senha',
          inp3: 'Permissão',
        },
      }

      //add global variables NodeJS
      global.myGlobal = { ...myGlobal }

      return { myGlobal }
    } catch (error) {
      console.log(error)
    }
  }
})()