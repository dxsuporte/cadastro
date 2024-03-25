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
    const passwdAdm = createHmac('sha256', process.env.appKey).update('Admin@123').digest('hex')
    await DataBase('users').insert({ username: 'admin', password: passwdAdm, active: 1 })
    const passwdUser = createHmac('sha256', process.env.appKey).update('123456').digest('hex')
    await DataBase('users').insert({ username: 'user', password: passwdUser })
  }
}
startDataBase()

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
      devTools: true,
      preload: Path.join(__dirname, 'view/index/index.js'),
    },
  })
  await win.loadFile(Path.join(__dirname, 'view/index/index.html'))
  win.maximize()
  win.show()
}

//Janela Login
let winLogin
const loginWindow = async () => {
  winLogin = new BrowserWindow({
    icon: Icon,
    width: 800,
    height: 768,
    maxWidth: 800,
    maxHeight: 768,
    minWidth: 800,
    minHeight: 600,
    autoHideMenuBar: true,
    webPreferences: {
      devTools: true,
      preload: Path.join(__dirname, 'view/login/login.js'),
    },
  })
  await winLogin.loadFile(Path.join(__dirname, 'view/login/login.html'))
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

//Login
ipcMain.handle('login', async (_, obj) => {
  const passwordHash = createHmac('sha256', process.env.appKey).update(obj.password).digest('hex')
  await DataBase('users')
    .where({ username: obj.username, password: passwordHash })
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
