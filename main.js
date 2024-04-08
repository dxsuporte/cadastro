const start = async () => {
  /* Start Functions */

  //Path, Env JS and ejs-electron View
  const Path = require('node:path')
  const { GlobalView } = await require(Path.join(__dirname, 'env')).start()
  await require('ejs-electron').data(GlobalView).options('debug', false)

  //Modules for electron and ico Default
  const { app, BrowserWindow, ipcMain, nativeImage, Notification } = require('electron/main')
  const Icon = nativeImage.createFromPath(Path.join(__dirname, 'public/img/favicon.png'))

  //Import Controller
  const Register = await require(Path.join(__dirname, 'controller/RegisterController'))
  const User = await require(Path.join(__dirname, 'controller/UserController'))

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
        preload: Path.join(__dirname, 'view/preload.js'),
      },
    })

    /* //Link Window
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
    })*/
    await win.loadFile(Path.join(__dirname, 'view/register/index.ejs'))
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
        preload: Path.join(__dirname, 'view/login/preload.js'),
      },
    })
    await winLogin.loadFile(Path.join(__dirname, 'view/login/index.ejs'))
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

  //Router Index
  ipcMain.handle('index', async (_, page) => {
    let result
    if (page === 'register') result = await Register.index()
    if (page === 'user') result = await User.index()
    await win.webContents.send('table', result)
  })

  //Router Edit
  ipcMain.handle('edit', async (_, data) => {
    let result
    if (data.page === 'register') {
      delete data.page
      result = await Register.edit(data)
    }
    if (data.page === 'user') {
      delete data.page
      result = await User.edit(data)
    }
    if (result) {
      await win.webContents.send('editResponse', result)
    }
  })

  //Router Store
  ipcMain.handle('store', async (_, data) => {
    if (data.page === 'register') {
      if (!data.description) {
        new Notification({ title: 'Erro', body: 'Especialidade não pode ser nulo!' }).show()
      } else {
        delete data.page
        await Register.store(data)
      }
    }
    if (data.page === 'user') {
      if (!data.username || !data.password) {
        new Notification({ title: 'Erro', body: 'Especialidade não pode ser nulo!' }).show()
      } else {
        delete data.page
        await User.store(data)
      }
    }
    await win.webContents.reload()
  })

  //Router Update
  ipcMain.handle('update', async (_, data) => {
    if (data.page === 'register') {
      if (!data.description) {
        new Notification({ title: 'Erro', body: 'Especialidade não pode ser nulo!' }).show()
      } else {
        delete data.page
        await Register.update(data)
      }
    }
    if (data.page === 'user') {
      if (!data.username || !data.password) {
        new Notification({ title: 'Erro', body: 'Especialidade não pode ser nulo!' }).show()
      } else {
        delete data.page
        await User.update(data)
      }
    }
    await win.webContents.reload()
  })

  //Router Destroy
  ipcMain.handle('destroy', async (_, data) => {
    if (data.page === 'register') {
      delete data.page
      await Register.destroy(data)
    }
    if (data.page === 'user') {
      delete data.page
      await User.destroy(data)
    }
    await win.webContents.reload()
  })

  /* End of Functions */
}
start()
