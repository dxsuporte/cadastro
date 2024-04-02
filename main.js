//Modules for electron
const { app, BrowserWindow, ipcMain, nativeImage, Notification } = require('electron')
//File and directory
const Path = require('path')
//Ico Default
const Icon = nativeImage.createFromPath(Path.join(__dirname, 'public/img/favicon.png'))
//Gerenciar View EJS
const ElectronEjs = require('electron-ejs')
//Global View variables
const GlobalView = require(Path.join(__dirname, 'global-view.json'))
new ElectronEjs(GlobalView)
//File Default
process.env.BASE_URL = Path.join(__dirname)
//Secret Crypto
process.env.APP_KEY = '7tHZV-E2iyWajI9vu1m4MKF8-r5GVxIE'

//Index Window
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

//Login Window
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

// Start
app.whenReady().then(async () => {
  await loginWindow()
  //await createIndex()
  app.on('activate', async () => {
    if (BrowserWindow.getAllWindows().length === 0) await createIndex()
  })
})

//To close
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})

ipcMain.on('close-window', () => {
  if (process.platform !== 'darwin') app.quit()
})

//Reload
ipcMain.handle('reload', async (_, obj) => {
  await win.webContents.reload()
})

//Import User Controller
const User = require(Path.join(__dirname, 'controller/UserController'))

//Router Login User
ipcMain.handle('login', async (_, obj) => {
  const result = await User.login(obj)
  if (result) {
    await createIndex()
    await win.show()
    await winLogin.close()
  } else {
    new Notification({ title: 'Erro', body: 'Usuário ou senha inválidos' }).show()
  }
})

//Import Register Controller
const Register = require(Path.join(__dirname, 'controller/RegisterController'))

//Router Index Register
ipcMain.handle('index', async () => {
  const result = await Register.index()
  await win.webContents.send('table', result)
})

//Router Edit Register
ipcMain.handle('edit', async (_, obj) => {
  const result = await Register.edit(obj)
  await win.webContents.send('editResponse', result)
})

//Router Create Register
ipcMain.handle('create', async (_, obj) => {
  await Register.create(obj)
  await win.webContents.reload()
})

//Router Update Register
ipcMain.handle('update', async (_, obj) => {
  await Register.update(obj)
  await win.webContents.reload()
})

//Router Destroy Register
ipcMain.handle('destroy', async (_, obj) => {
  await Register.destroy(obj)
  await win.webContents.reload()
})
