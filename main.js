const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const Path = require('path')
const Sqlite3 = require('sqlite3').verbose()
//Gerenciar Database via SQL
const PureSQL = new Sqlite3.Database(Path.join(__dirname, 'database/database.sql'))
//Gerenciar Conexão Knex
const DataBase = require(Path.join(__dirname, 'database/connection'))
//Verificar ou Criar Database
const startDataBase = async () => {
  try {
    await DataBase('dxdesk_migrations')
  } catch (error) {
    await DataBase.migrate.latest()
    await DataBase('users').insert({ username: 'admin', password: 123456 })
  }
}
startDataBase()

let win
let winlogin
const createWindow = () => {
  win = new BrowserWindow({
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      devTools: true,
      preload: Path.join(__dirname, 'view/index/index.js'),
    },
  })
  win.loadFile('view/index/index.html')
  win.maximize()
  win.show()
}

function loginWindow() {
  winlogin = new BrowserWindow({
    minWidth: 900,
    minHeight: 550,
    autoHideMenuBar: true,
    webPreferences: {
      devTools: true,
      preload: Path.join(__dirname, 'view/login/login.js'),
    },
  })
  winlogin.loadFile('view/login/login.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

//Login
ipcMain.handle('login', (event, obj) => {
  const { email, password } = obj
  const sql = 'SELECT * FROM user WHERE email=? AND password=?'
  DataBase.all(sql, [email, password], (error, results, fields) => {
    if (error) console.log(error)
    if (results.length > 0) {
      createWindow()
      win.show()
      winlogin.close()
    } else {
      new Notification({ title: 'Login', body: 'E-mail ou senha inválidos' }).show()
    }
  })
})

//Index
ipcMain.handle('index', async () => {
  PureSQL.all('SELECT * FROM registers', (error, results) => {
    if (error) console.log(error)
    win.webContents.send('table', results)
  })
  /* const result = await DataBase('registers').orderBy('id', 'desc')
  await win.webContents.send('table', result) */
})

//Edit
ipcMain.handle('edit', async (event, obj) => {
  const result = await DataBase('registers').where({ id: obj }).first()
  await win.webContents.send('editResponse', result)
})

//Create
ipcMain.handle('create', async (event, obj) => {
  await DataBase('registers').insert({ ...obj })
  await win.webContents.reload()
})

//Update
ipcMain.handle('update', async (event, obj) => {
  await DataBase('registers')
    .update({ ...obj })
    .where({ id: obj.id })
  await win.webContents.reload()
})

//Destroy
ipcMain.handle('destroy', async (event, obj) => {
  await DataBase('registers').del().where({ id: obj })
  await win.webContents.reload()
})
