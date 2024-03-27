//Import
const { ipcRenderer } = require('electron')

window.onload = async () => {
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

  //Create, Update
  document.getElementById('createUpdate').onclick = async () => {
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
      await ipcRenderer.invoke('create', data)
    } else {
      await ipcRenderer.invoke('update', data)
    }
  }

  //Edit
  const edit = async (obj) => {
    await ipcRenderer.invoke('edit', obj.target.getAttribute('value'))
  }
  ipcRenderer.on('editResponse', (_, result) => {
    id.value = result.id
    name.value = result.name
    surname.value = result.surname
    description.value = result.description
    note.value = result.note
    phone.value = result.phone
    obs.value = result.obs
    //Class btn Destroy
    document.getElementById('destroy').classList.remove('d-none')
    //focus
    document.getElementById('description').focus()
  })

  //Destroy
  document.getElementById('destroy').onclick = async () => {
    if (id.value) {
      await ipcRenderer.invoke('destroy', id.value)
    }
  }

  //Table
  ipcRenderer.on('table', async (_, obj) => {
    let tbody = document.getElementById('tbody')
    await obj.forEach((result) => {
      tbody.innerHTML += `<tr>
        <td value="${result.id}">${result.description || ''}<div class="text-danger"><small>${result.obs || ''}</small></div></td>
        <td value="${result.id}">${result.note || ''}</td>
        <td value="${result.id}">${result.name || ''}</td>
        <td value="${result.id}">${result.surname || ''}</td>
        <td value="${result.id}">${result.phone || ''}</td>
        </tr>`
    })
    //Edit
    document.querySelectorAll('#tbody td').forEach((obj) => {
      obj.addEventListener('click', edit)
    })
  })

  //permissions
  if (process.env.authActive != '1') {
    document.getElementById('divRegister').style.display = 'none'
  }
}
