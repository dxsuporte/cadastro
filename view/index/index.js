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
  document.getElementById('name').focus()

  //Table
  ipcRenderer.on('table', async (event, obj) => {
    console.log(obj)
    let tbody = document.getElementById('tbody')
    await obj.forEach((event) => {
      tbody.innerHTML += `<tr>
      <td value="${event.id}">${event.description || ''}<div class="text-danger"><small>${event.obs || ''}</small></div></td>
      <td value="${event.id}">${event.note || ''}</td>
      <td value="${event.id}">${event.name || ''}</td>
      <td value="${event.id}">${event.surname || ''}</td>
      <td value="${event.id}">${event.phone || ''}</td>
      ${process.env.authActive != '1' ? '' : `<th><button class="btn btn-danger btn-sm btn-block btnDelete" value="${event.id}"> <i class="bi bi-trash-fill"></i></button></th>`}
      </tr>`
    })
    //Edit
    document.querySelectorAll('#tbody td').forEach((event) => {
      event.addEventListener('click', edit)
    })
    //Delete
    document.querySelectorAll('.btnDelete').forEach((boton) => {
      boton.addEventListener('click', destroy)
    })
  })

  //Edit
  async function edit(event) {
    await ipcRenderer.invoke('edit', event.target.getAttribute('value'))
  }
  ipcRenderer.on('editResponse', (event, result) => {
    id.value = result.id
    name.value = result.name
    surname.value = result.surname
    description.value = result.description
    note.value = result.note
    phone.value = result.phone
    obs.value = result.obs
    //focus
    document.getElementById('name').focus()
    //ScrollTo Top
    window.scrollTo(xCoord, yCoord)
  })

  //Delete
  async function destroy(event) {
    await ipcRenderer.invoke('destroy', event.target.value)
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
