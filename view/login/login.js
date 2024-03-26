const { ipcRenderer } = require('electron')

window.onload = async () => {
  //Imputs
  let username = document.getElementById('username')
  let password = document.getElementById('password')
  //login
  const login = document.getElementById('login')
  login.onclick = () => {
    const obj = { username: username.value, password: password.value }
    ipcRenderer.invoke('login', obj)
  }
}
