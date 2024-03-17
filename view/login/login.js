const { ipcRenderer } = require('electron')

window.onload = async () => {
  //Imputs
  let username = document.getElementById('username')
  let password = document.getElementById('password')
  //focus
  document.getElementById('username').focus()
  //login
  const btnlogin = document.getElementById('login')
  btnlogin.onclick = () => {
    const obj = { username: username.value, password: password.value }
    ipcRenderer.invoke('login', obj)
  }
}
