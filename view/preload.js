//Import
const { ipcRenderer, contextBridge } = require('electron')

window.addEventListener('DOMContentLoaded', async () => {
  //Page Variable
  const page = document.getElementById('page').value
  //Function Register
  const startRegister = async () => {
    /* Start Functions Register */

    //Index register
    const loadTable = async () => {
      await ipcRenderer.invoke('index', page)
    }
    setTimeout(loadTable, 100)

    //Inputs register
    let id = document.getElementById('idHidden')
    let name = document.getElementById('name')
    let surname = document.getElementById('surname')
    let description = document.getElementById('description')
    let note = document.getElementById('note')
    let phone = document.getElementById('phone')
    let obs = document.getElementById('obs')

    //Store, Update - register
    document.getElementById('storeUpdate').onclick = async () => {
      const data = {
        page: page,
        id: id.value,
        name: name.value,
        surname: surname.value,
        description: description.value,
        note: note.value,
        phone: phone.value,
        obs: obs.value,
      }
      if (!data.id) {
        delete data.id
        await ipcRenderer.invoke('store', data)
      } else {
        await ipcRenderer.invoke('update', data)
      }
    }

    //Edit register
    const edit = async (data) => {
      await ipcRenderer.invoke('edit', { id: data.target.getAttribute('value'), page: page })
    }
    ipcRenderer.on('editResponse', (_, result) => {
      id.value = result.id
      name.value = result.name
      surname.value = result.surname
      description.value = result.description
      note.value = result.note
      phone.value = result.phone
      obs.value = result.obs
      //Class btn Destroy and Cancel
      document.getElementById('destroy').classList.remove('d-none')
      document.getElementById('cancel').classList.remove('d-none')
      //focus
      document.getElementById('description').focus()
    })

    //Destroy register
    document.getElementById('destroy').onclick = async () => {
      if (id.value) {
        await ipcRenderer.invoke('destroy', { id: id.value, page: page })
      }
    }

    //Table register
    ipcRenderer.on('table', async (_, data) => {
      let tbody = document.getElementById('tbody')
      await data.forEach((result) => {
        tbody.innerHTML += `<tr>
        <td value="${result.id}">${result.description || ''}<div class="text-danger"><small>${result.obs || ''}</small></div></td>
        <td value="${result.id}">${result.note || ''}</td>
        <td value="${result.id}">${result.name || ''}</td>
        <td value="${result.id}">${result.surname || ''}</td>
        <td value="${result.id}">${result.phone || ''}</td>
        </tr>`
      })
      //Edit register
      document.querySelectorAll('#tbody td').forEach((data) => {
        data.addEventListener('click', edit)
      })
    })

    /* End of Functions Registe */
  }

  //Function User
  const startUser = async () => {
    /* Start Functions User */

    //Index User
    const loadTable = async () => {
      await ipcRenderer.invoke('index', page)
    }
    setTimeout(loadTable, 100)

    //Inputs User
    let id = document.getElementById('idHidden')
    let username = document.getElementById('username')
    let password = document.getElementById('password')
    let active = document.getElementById('active')

    //Store, Update - User
    document.getElementById('storeUpdate').onclick = async () => {
      const data = {
        page: page,
        id: id.value,
        username: username.value,
        password: password.value,
        active: active.value,
      }
      if (!data.id) {
        delete data.id
        await ipcRenderer.invoke('store', data)
      } else {
        await ipcRenderer.invoke('update', data)
      }
    }

    //Edit User
    const edit = async (data) => {
      await ipcRenderer.invoke('edit', { id: data.target.getAttribute('value'), page: page })
    }
    ipcRenderer.on('editResponse', (_, result) => {
      id.value = result.id
      username.value = result.username
      active.value = result.active
      //Class btn Destroy and Cancel
      document.getElementById('destroy').classList.remove('d-none')
      document.getElementById('cancel').classList.remove('d-none')
      //focus
      document.getElementById('description').focus()
    })

    //Destroy User
    document.getElementById('destroy').onclick = async () => {
      if (id.value) {
        await ipcRenderer.invoke('destroy', { id: id.value, page: page })
      }
    }

    //Table User
    ipcRenderer.on('table', async (_, data) => {
      let tbody = document.getElementById('tbody')
      await data.forEach((result) => {
        tbody.innerHTML += `<tr>
          <td value="${result.id}">${result.username}</td>
          <td value="${result.id}">${result.active == 1 ? 'Admin' : 'Visualização'}</td>
          </tr>`
      })
      //Edit User
      document.querySelectorAll('#tbody td').forEach((data) => {
        data.addEventListener('click', edit)
      })
    })

    /* End of Functions User */
  }

  //Page If
  if (page === 'register') await startRegister()
  if (page === 'user') await startUser()

  //Reload
  document.getElementById('cancel').onclick = async () => {
    window.location.reload(true)
  }

  //permissions
  if (process.env.authActive != '1') {
    document.getElementById('pane-left').style.display = 'none'
    document.getElementById('btn-user').style.display = 'none'
  }
})
