//Requires
const Path = require('node:path')
const Fs = require('node:fs')

module.exports = new (class myStart {
  async start() {
    try {
      //Variável do aquivo de configuração do banco de dados
      let FILE_CONFIG_DB = Path.join(__dirname, 'database/db-config.json')
      //Variável do aquivo de banco de dados
      let DB_FILE = Path.join(__dirname, 'database/database.sql')
      //Variável do diretório do ASAR
      let ASAR_FILE = `${process.env.HOME}/.cadastro/`

      //Se o diretório for compilado com ASAR
      if (__dirname.includes('app.asar')) {
        //tocas os diretórios do aquivo de banco de dado
        FILE_CONFIG_DB = Path.join(`${ASAR_FILE}db-config.json`)
        DB_FILE = Path.join(`${ASAR_FILE}database.sql`)
        //Se a o sistema for Windows
        if (process.platform === 'win32') {
          ASAR_FILE = `${process.env.APPDATA}/.cadastro/`
          FILE_CONFIG_DB = Path.join(`${ASAR_FILE}db-config.json`)
          DB_FILE = Path.join(`${ASAR_FILE}database.sql`)
        }
        //Se não existir, cria a pasta
        if (!Fs.existsSync(ASAR_FILE)) {
          Fs.mkdirSync(ASAR_FILE, { recursive: true })
        }
      }

      //Se não existir cria o aquivo de configuração do banco de dados
      if (!Fs.existsSync(FILE_CONFIG_DB)) {
        Fs.writeFileSync(FILE_CONFIG_DB, JSON.stringify({ DB_CONNECTION: '', DB_NAME: '', DB_USER: '', DB_PASSWORD: '' }))
      }

      //Configuração da variáveis global ENV
      const DataBase = require(FILE_CONFIG_DB)
      process.env.DB_FILE = DB_FILE
      process.env.DB_CONNECTION = DataBase.DB_CONNECTION
      process.env.DB_NAME = DataBase.DB_NAME
      process.env.DB_USER = DataBase.DB_USER
      process.env.DB_PASSWORD = DataBase.DB_PASSWORD
      process.env.BASE_URL = Path.join(__dirname)
      process.env.APP_KEY = '7tHZV-E2iyWajI9vu1m4MKF8-r5GVxIE'

      //Variáveis Global da View ejs
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
      //Adicionar as variáveis no global do NodeJS
      global.myGlobal = { ...myGlobal }
      //Retorna para main com as variável global
      return { myGlobal }
    } catch (error) {
      //tratamento de erro
      console.log(error)
    }
  }
})()
