//Import
const { ipcRenderer, contextBridge } = require('electron')

contextBridge.exposeInMainWorld('myAPI', {
  desktop: true,
})

window.addEventListener('DOMContentLoaded', async () => {
  //Index
  const loadTable = async () => {
    await ipcRenderer.invoke('index')
  }
  setTimeout(loadTable, 100)

  //Inputs
  let id = document.getElementById('idHidden')
  let name = document.getElementById('name')
  let surname = document.getElementById('surname')
  let description = document.getElementById('description')
  let note = document.getElementById('note')
  let phone = document.getElementById('phone')
  let obs = document.getElementById('obs')

  //Store, Update
  document.getElementById('storeUpdate').onclick = async () => {
    const data = {
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

  //Edit
  const edit = async (data) => {
    await ipcRenderer.invoke('edit', { id: data.target.getAttribute('value') })
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

  //Destroy
  document.getElementById('destroy').onclick = async () => {
    if (id.value) {
      await ipcRenderer.invoke('destroy', { id: id.value })
    }
  }

  //Table
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
    //Edit
    document.querySelectorAll('#tbody td').forEach((data) => {
      data.addEventListener('click', edit)
    })
  })

  //Reload
  document.getElementById('home').onclick = async () => {
    await ipcRenderer.invoke('reload')
  }
  document.getElementById('cancel').onclick = async () => {
    await ipcRenderer.invoke('reload')
  }

  //permissions
  if (process.env.authActive != '1') {
    document.getElementById('pane-left').style.display = 'none'
  }
})
