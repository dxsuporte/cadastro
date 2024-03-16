const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const Path = require('path')
const DataBase = require('./database/database')

let win
let winlogin
function createWindow() {
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
ipcMain.handle('index', () => {
  DataBase.all('SELECT * FROM product', (error, results) => {
    if (error) console.log(error)
    win.webContents.send('table', results)
  })
})

//Edit
ipcMain.handle('edit', (event, obj) => {
  let sql = 'SELECT * FROM product WHERE id = ?'
  DataBase.all(sql, obj, (error, results, fields) => {
    if (error) console.log(error)
    win.webContents.send('editResponse', results[0])
  })
})

//Create
ipcMain.handle('create', (event, obj) => {
  const sql = 'INSERT INTO product(name, price) VALUES(?, ?)'
  DataBase.run(sql, obj, (error) => {
    if (error) console.log(error)
  })
})

//Update
ipcMain.handle('update', (event, obj) => {
  const sql = 'UPDATE product SET name=?, price=? WHERE id=?'
  DataBase.run(sql, obj, (error, results, fields) => {
    if (error) console.log(error)
  })
})

//Destroy
ipcMain.handle('destroy', (event, obj) => {
  const sql = 'DELETE FROM product WHERE id = ?'
  DataBase.all(sql, obj, (error, results, fields) => {
    if (error) console.log(error)
  })
})
