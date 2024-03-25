//Import
const { ipcRenderer } = require('electron')

window.onload = async () => {
  //Index
  const loadTable = async () => {
    await ipcRenderer.invoke('index')
  }
  setTimeout(loadTable, 100)

  //Imputs
  let id = document.getElementById('idProduct')
  let name = document.getElementById('name')
  let surname = document.getElementById('surname')
  let description = document.getElementById('description')
  let note = document.getElementById('note')
  let phone = document.getElementById('phone')
  let obs = document.getElementById('obs')
  //focus
  document.getElementById('description').focus()

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
      ${process.env.authActive != '1' ? '' : `<th><button class="btn btn-danger btn-sm btn-block btnDelete" value="${result.id}"> <i class="bi bi-trash-fill"></i></button></th>`}
      </tr>`
    })
    //Edit
    document.querySelectorAll('#tbody td').forEach((obj) => {
      obj.addEventListener('click', edit)
    })
    //Delete
    document.querySelectorAll('.btnDelete').forEach((obj) => {
      obj.addEventListener('click', destroy)
    })
  })

  //Edit
  async function edit(obj) {
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
    //focus
    document.getElementById('description').focus()
    //ScrollTo Top
    window.scrollTo(xCoord, yCoord)
  })

  //Delete
  async function destroy(obj) {
    await ipcRenderer.invoke('destroy', obj.target.value)
  }

  //Register
  const btnRegister = document.getElementById('btnRegister')
  btnRegister.onclick = createUpdate
  async function createUpdate() {
    let obj
    if (!id.value) {
      obj = {
        name: name.value,
        surname: surname.value,
        description: description.value,
        note: note.value,
        phone: phone.value,
        obs: obs.value,
      }
      await ipcRenderer.invoke('create', obj)
    } else {
      obj = {
        id: id.value,
        name: name.value,
        surname: surname.value,
        description: description.value,
        note: note.value,
        phone: phone.value,
        obs: obs.value,
      }
      await ipcRenderer.invoke('update', obj)
    }
  }

  //permissions
  if (process.env.authActive != '1') {
    document.getElementById('divRegister').style.display = 'none'
    document.getElementById('thDelete').style.display = 'none'
  }
}
