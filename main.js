const start = async () => {
  /* Start Functions */

  //Path, Env JS and ejs-electron View
  const Path = require('node:path')
  const { GlobalView } = await require(Path.join(__dirname, 'env')).index()
  await require('ejs-electron').data(GlobalView).options('debug', false)

  //Modules for electron and ico Default
  const { app, BrowserWindow, ipcMain, nativeImage, Notification } = require('electron/main')
  const Icon = nativeImage.createFromPath(Path.join(__dirname, 'public/img/favicon.png'))

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

    //Link Window
    win.webContents.setWindowOpenHandler(({ url }) => {
      console.log(url)
      return {
        action: 'allow',
        overrideBrowserWindowOptions: {
          icon: Icon,
          width: 1024,
          height: 768,
          minWidth: 800,
          minHeight: 600,
          autoHideMenuBar: true,
          webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            devTools: true,
          },
        },
      }
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

  //Login to close
  ipcMain.on('close-window', () => {
    if (process.platform !== 'darwin') app.quit()
  })

  //Reload
  ipcMain.handle('reload', async () => {
    await win.webContents.reload()
  })

  /*------------------Routers------------------------*/

  //Router Login User
  ipcMain.handle('login', async (_, data) => {
    const result = await User.login(data)
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
  ipcMain.handle('edit', async (_, data) => {
    const result = await Register.edit(data)
    if (result) {
      await win.webContents.send('editResponse', result)
    }
  })

  //Router Store Register
  ipcMain.handle('store', async (_, data) => {
    if (!data.description) {
      new Notification({ title: 'Erro', body: 'Especialidade não pode ser nulo!' }).show()
    } else {
      await Register.store(data)
      await win.webContents.reload()
    }
  })

  //Router Update Register
  ipcMain.handle('update', async (_, data) => {
    if (!data.name) {
      new Notification({ title: 'Erro', body: 'Especialidade não pode ser nulo!' }).show()
    } else {
      await Register.update(data)
      await win.webContents.reload()
    }
  })

  //Router Destroy Register
  ipcMain.handle('destroy', async (_, data) => {
    await Register.destroy(data)
    await win.webContents.reload()
  })

  /* End of Functions */
}
start()
