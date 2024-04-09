window.addEventListener('DOMContentLoaded', async () => {
  //Requires
  const { ipcRenderer } = require('electron')
  //Close
  document.getElementById('cancel').onclick = () => {
    ipcRenderer.send('close-window')
  }
  //Login
  document.getElementById('login').onclick = async () => {
    const data = {
      username: document.getElementById('username').value,
      password: document.getElementById('password').value,
    }
    await ipcRenderer.invoke('login', data)
  }
})
