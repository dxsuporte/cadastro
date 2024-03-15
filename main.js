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

ipcMain.handle('login', (event, obj) => {
  validatelogin(obj)
})

function validatelogin(obj) {
  const { email, password } = obj
  const sql = 'SELECT * FROM user WHERE email=? AND password=?'
  DataBase.all(sql, [email, password], (error, results, fields) => {
    if (error) {
      console.log(error)
    }

    if (results.length > 0) {
      createWindow()
      win.show()
      winlogin.close()
    } else {
      new Notification({
        title: 'login',
        body: 'email o password equivocado',
      }).show()
    }
  })
}

ipcMain.handle('get', () => getProducts())
ipcMain.handle('add', (event, obj) => addProduct(obj))
ipcMain.handle('get_one', (event, obj) => getproduct(obj))
ipcMain.handle('remove_product', (event, obj) => deleteproduct(obj))
ipcMain.handle('update', (event, obj) => updateproduct(obj))

function getProducts() {
  DataBase.all('SELECT * FROM product', (error, results, fields) => {
    if (error) {
      console.log(error)
    }
    win.webContents.send('products', results)
  })
}

function addProduct(obj) {
  DataBase.run('INSERT INTO product(name, price) VALUES(?, ?)', obj, (err) => {
    if (err) {
      return console.log(err.message)
    }
    getProducts()
  })
}

function deleteproduct(obj) {
  const { id } = obj
  const sql = 'DELETE FROM product WHERE id = ?'
  DataBase.all(sql, id, (error, results, fields) => {
    if (error) {
      console.log(error)
    }
    getProducts()
  })
}

function getproduct(obj) {
  let { id } = obj
  let sql = 'SELECT * FROM product WHERE id = ?'
  DataBase.all(sql, id, (error, results, fields) => {
    if (error) {
      console.log(error)
    }
    win.webContents.send('product', results[0])
  })
}

function updateproduct(obj) {
  let { id, name, price } = obj
  const sql = 'UPDATE product SET name=?, price=? WHERE id=?'
  DataBase.all(sql, [name, price, id], (error, results, fields) => {
    if (error) {
      console.log(error)
    }
    getProducts()
  })
}
