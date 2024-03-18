//Modules for electron
const { app, BrowserWindow, ipcMain, nativeImage, Notification } = require('electron')
//Password Crypto
const { createHmac } = require('node:crypto')
//Secret Crypto
process.env.appKey = '7tHZV-E2iyWajI9vu1m4MKF8-r5GVxIE'
//File and directory
const Path = require('path')
//Ico Default
const Icon = nativeImage.createFromPath(Path.join(__dirname, 'public/img/favicon.png'))
//Gerenciar Conexão KnexJS SQL
const DataBase = require(Path.join(__dirname, 'database/connection'))

//Verificar ou Criar Database
const startDataBase = async () => {
  try {
    await DataBase('migrations')
  } catch (error) {
    await DataBase.migrate.latest()
    await DataBase('users').insert({ username: 'root', active: 1 })
    await DataBase('users').insert({ username: 'admin', active: 1 })
    const passwordHash = createHmac('sha256', process.env.appKey).update('123456').digest('hex')
    await DataBase('users').insert({ username: 'user', password: passwordHash })
  }
}
startDataBase()

let win
let winlogin
const createWindow = () => {
  win = new BrowserWindow({
    icon: Icon,
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
    icon: Icon,
    width: 800,
    height: 600,
    maxWidth: 800,
    maxHeight: 600,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: {
      devTools: true,
      preload: Path.join(__dirname, 'view/login/login.js'),
    },
  })
  winlogin.loadFile('view/login/login.html')
}

// Iniciar
app.whenReady().then(() => {
  loginWindow()
  //createWindow()
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

//Fechar
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//Login
ipcMain.handle('login', async (event, obj) => {
  const passwordHash = createHmac('sha256', process.env.appKey).update(obj.password).digest('hex')
  await DataBase('users')
    .where({ username: obj.username, password: passwordHash })
    .first()
    .then(async (result) => {
      if (result) {
        process.env.authUser = result.username
        process.env.authActive = result.active
        createWindow()
        await win.show()
        await winlogin.close()
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
