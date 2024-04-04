//Requires
const Path = require('path')
const Fs = require('fs')

module.exports = new (class env {
  async index() {
    //json configuration file
    const file = Path.join(__dirname, __dirname.includes('app.asar') ? '../config.json' : '/config.json')
    if (!Fs.existsSync(file)) {
      Fs.writeFileSync(file, JSON.stringify({ DB_CONNECTION: '', DB_NAME: '', DB_USER: '', DB_PASSWORD: '' }))
    }
    const config = require(file)
    process.env.DB_CONNECTION = config.DB_CONNECTION
    process.env.DB_NAME = config.DB_NAME
    process.env.DB_USER = config.DB_USER
    process.env.DB_PASSWORD = config.DB_PASSWORD
    process.env.APP_KEY = '7tHZV-E2iyWajI9vu1m4MKF8-r5GVxIE'
    //File Default
    process.env.BASE_URL = Path.join(__dirname)
  }
})()
