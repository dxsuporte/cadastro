//Modules for electron
const { app, BrowserWindow, ipcMain, nativeImage, Notification } = require('electron')
//File and directory
const Path = require('path')
//Ico Default
const Icon = nativeImage.createFromPath(Path.join(__dirname, 'public/img/favicon.png'))
//Password Crypto
const { createHmac } = require('node:crypto')
//Gerenciar View EJS
const ElectronEjs = require('electron-ejs')
new ElectronEjs({ TITLE: 'Cadastro básico', AUTHOR: 'DX Suporte' })
//File Default
process.env.BASE_URL = Path.join(__dirname)
//Secret Crypto
process.env.APP_KEY = '7tHZV-E2iyWajI9vu1m4MKF8-r5GVxIE'
//Gerenciar Conexão KnexJS SQL
const DataBase = require(Path.join(__dirname, 'database/connection'))

//Janela Index
let win
const createIndex = async () => {
  win = new BrowserWindow({
    icon: Icon,
    width: 1024,
    height: 768,
    minWidth: 800,
    minHeight: 600,
    show: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: Path.join(__dirname, 'view/index/index.js'),
    },
  })
  await win.loadFile(Path.join(__dirname, 'view/index/index.ejs'))
  win.maximize()
  win.show()
}

//Janela Login
let winLogin
const loginWindow = async () => {
  winLogin = new BrowserWindow({
    icon: Icon,
    maxWidth: 600,
    minWidth: 600,
    maxHeight: 350,
    minHeight: 350,
    frame: false,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      devTools: true,
      preload: Path.join(__dirname, 'view/login/login.js'),
    },
  })
  await winLogin.loadFile(Path.join(__dirname, 'view/login/login.ejs'))
}

// Iniciar
app.whenReady().then(async () => {
  await loginWindow()
  //await createIndex()
  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) await createIndex()
  })
})

//Fechar
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('close-window', () => {
  if (process.platform !== 'darwin') app.quit()
})

//Login
ipcMain.handle('login', async (_, obj) => {
  const password = createHmac('sha256', process.env.APP_KEY).update(obj.password).digest('hex')
  await DataBase('users')
    .where({ username: obj.username, password: password })
    .first()
    .then(async (result) => {
      if (result) {
        process.env.authUser = result.username
        process.env.authActive = result.active
        await createIndex()
        await win.show()
        await winLogin.close()
      } else {
        new Notification({ title: 'Erro', body: 'Usuário ou senha inválidos' }).show()
      }
    })
})

//Index
ipcMain.handle('index', async () => {
  const result = await DataBase('registers').orderBy('id', 'desc')
  await win.webContents.send('table', result)
})

//Edit
ipcMain.handle('edit', async (_, obj) => {
  const result = await DataBase('registers').where({ id: obj }).first()
  await win.webContents.send('editResponse', result)
})

//Create
ipcMain.handle('create', async (_, obj) => {
  await DataBase('registers').insert({ ...obj })
  await win.webContents.reload()
})

//Update
ipcMain.handle('update', async (_, obj) => {
  await DataBase('registers')
    .update({ ...obj })
    .where({ id: obj.id })
  await win.webContents.reload()
})

//Destroy
ipcMain.handle('destroy', async (_, obj) => {
  await DataBase('registers').del().where({ id: obj })
  await win.webContents.reload()
})

//Reload
ipcMain.handle('reload', async (_, obj) => {
  await win.webContents.reload()
})
