const sqlite3 = require('sqlite3').verbose()
const filepath = './database/database.sql'

const DataBase = new sqlite3.Database(filepath, (error) => {
  if (error) {
    return console.error(error.message)
  }
  //createTable(DataBase);
})

function createTable(DataBase) {
  DataBase.exec(`
    CREATE TABLE user
    (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      email   VARCHAR(255) NOT NULL,
      password   VARCHAR(255) NOT NULL
    );
    CREATE TABLE product
    (
      ID INTEGER PRIMARY KEY AUTOINCREMENT,
      name   VARCHAR(255) NOT NULL,
      price   INT(10) NOT NULL
    );
  `)
}

module.exports = DataBase
