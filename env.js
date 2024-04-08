//Requires
const Path = require('node:path')
const Fs = require('fs')

module.exports = new (class env {
  async index() {
    //DataBase configuration file
    const DataBaseConfig = Path.join(__dirname, __dirname.includes('app.asar') ? '../dbConfig.json' : '/database/dbConfig.json')
    if (!Fs.existsSync(DataBaseConfig)) {
      Fs.writeFileSync(DataBaseConfig, JSON.stringify({ DB_CONNECTION: '', DB_NAME: '', DB_USER: '', DB_PASSWORD: '' }))
    }
    const DataBase = require(DataBaseConfig)
    process.env.DB_CONNECTION = DataBase.DB_CONNECTION
    process.env.DB_NAME = DataBase.DB_NAME
    process.env.DB_USER = DataBase.DB_USER
    process.env.DB_PASSWORD = DataBase.DB_PASSWORD
    process.env.APP_KEY = '7tHZV-E2iyWajI9vu1m4MKF8-r5GVxIE'
    //File Default
    process.env.BASE_URL = Path.join(__dirname)

    const GlobalView = {
      TITLE: 'Cadastro Básico',
      AUTHOR: 'DX Suporte',
      PASSWORD: { name: 'Senha', icon: " <i class='bi bi-key-fill'></i> " },
      USER: { name: 'Usuário', icon: " <i class='bi bi-person-circle'></i> " },
      REGISTER: { name: 'Registro', icon: " <i class='bi bi-people'></i> " },
      SAVE: { name: 'Salvar', icon: " <i class='bi bi-check-circle-fill'></i> " },
      CANCEL: { name: 'Cancelar', icon: " <i class='bi bi-x-octagon-fill'></i> " },
      EDIT: { name: 'Editar', icon: " <i class='bi bi-pencil-square'></i> " },
      DELETE: { name: 'Deletar', icon: " <i class='bi bi-trash-fill'></i> " },
      SEARCH: { name: 'Buscar', icon: " <i class='bi bi-search'></i> " },
      TABLE: { name: 'Tabela', icon: " <i class='bi bi-table'></i> " },
      LOGIN: { name: 'Login', icon: " <i class='bi bi-box-arrow-right'></i> " },
      HOME: { name: 'Home', icon: " <i class='bi bi-house-fill'></i> " },
      INDEX: {
        name: 'Gerenciar registros',
        list: 'Lista de registros',
        inp1: 'Especialidade',
        inp2: 'Atuação',
        inp3: 'Nome',
        inp4: 'Andar',
        inp5: 'Telefone',
        inp6: 'Observação',
      },
    }
    return { GlobalView }
  }
})()
