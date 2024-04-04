const start = async () => {
  /* Start Functions */

  //File and directory
  const Path = require('path')

  //Env JS
  const Env = await require(Path.join(__dirname, 'env'))
  await Env.index()

  //Modules for electron
  const { app, BrowserWindow, ipcMain, nativeImage, Notification } = require('electron')
  //Ico Default
  const Icon = nativeImage.createFromPath(Path.join(__dirname, 'public/img/favicon.png'))

  //Global View variables and to manage view EJS
  const GlobalView = await require(Path.join(__dirname, 'global-view.json'))
  await require('ejs-electron').data(GlobalView).options('debug', false)

  //Import Controller
  const User = await require(Path.join(__dirname, 'controller/UserController'))
  const Register = await require(Path.join(__dirname, 'controller/RegisterController'))

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

  /*------------------Routers------------------------*/

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

  /* End of Functions */
}
start()
