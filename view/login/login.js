const { ipcRenderer } = require('electron')

window.onload = async () => {
  //Close
  document.getElementById('cancel').onclick = () => {
    ipcRenderer.send('close-window')
  }
  //Login
  document.getElementById('login').onclick = async () => {
    const obj = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
    }
    await ipcRenderer.invoke('login', obj)
  }
}
