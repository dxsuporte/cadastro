//Import
const { ipcRenderer } = require('electron')

window.onload = async () => {
  //Index
  await ipcRenderer.invoke('index')

  //Imputs
  let id = document.getElementById('idProduct')
  let name = document.getElementById('name')
  let surname = document.getElementById('surname')
  let description = document.getElementById('description')
  let note = document.getElementById('note')
  let phone = document.getElementById('phone')
  //focus
  document.getElementById('name').focus()

  //Table
  ipcRenderer.on('table', async (event, obj) => {
    let tbody = document.getElementById('tbody')
    await obj.forEach((event) => {
      tbody.innerHTML += `<tr>
      <td value="${event.id}">${event.name}</td>
      <td value="${event.id}">${event.surname}</td>
      <td value="${event.id}">${event.description}</td>
      <td value="${event.id}">${event.note}</td>
      <td value="${event.id}">${event.phone}</td>
      ${process.env.authActive != '1' ? '' : `<td><button class="btn btn-danger btn-sm btn-block btnDelete" value="${event.id}"> <i class="bi bi-trash-fill"></i></button></td>`}
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
      }
      await ipcRenderer.invoke('update', obj)
    }
  }

  if (process.env.authActive != '1') {
    document.getElementById('divRegister').style.display = 'none'
    document.getElementById('thDelete').style.display = 'none'
  }
}
