//Modules for electron
const { app, BrowserWindow, ipcMain, Notification } = require('electron')
//File and directory
const Path = require('path')
//Ico Default
const icon = nativeImage.createFromPath(Path.join(__dirname, 'img/favicon.png'))
//Gerenciar Conexão KnexJS SQL
const DataBase = require(Path.join(__dirname, 'database/connection'))

//Verificar ou Criar Database
const startDataBase = async () => {
  try {
    await DataBase('migrations')
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
    icon: icon,
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
    icon: icon,
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

// Iniciar
app.whenReady().then(() => {
  createWindow()
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
  DataBase('registers')
    .orderBy('id', 'desc')
    .then(async (obj) => {
      await win.webContents.send('table', obj)
    })
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
