const { ipcRenderer } = require('electron')

window.onload = async () => {
  document.getElementById('login').onclick = () => {
  const obj = {
    username: document.getElementById('username').value,
    password: document.getElementById('password').value,
  }
    ipcRenderer.invoke('login', obj)
  }
}
