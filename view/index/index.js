//Import
const { ipcRenderer } = require('electron')

//Variables
let tbody, btnRegister, btnEdit, btnDelete

window.onload = async () => {
  //Index
  await ipcRenderer.invoke('index')

  let id = document.getElementById('idproduct')
  let name = document.getElementById('name')
  let surname = document.getElementById('surname')

  //Table
  ipcRenderer.on('table', async (event, obj) => {
    tbody = document.getElementById('tbody')
    await obj.forEach((event) => {
      tbody.innerHTML += `<tr>
            <td>${event.name}</td>
            <td>${event.surname}</td>
            <td>
            <button class="btn btn-primary mr-1 btnEdit" value="${event.id}">edit</button>
            <button class="btn btn-danger btnDelete" value="${event.id}">delete</button>
            </td>
         </tr>`
    })
    //Edit
    btnEdit = document.querySelectorAll('.btnEdit')
    btnEdit.forEach((boton) => {
      boton.addEventListener('click', edit)
    })
    //Delete
    btnDelete = document.querySelectorAll('.btnDelete')
    btnDelete.forEach((boton) => {
      boton.addEventListener('click', destroy)
    })
  })

  //Edit
  async function edit(event) {
    await ipcRenderer.invoke('edit', event.target.value)
  }

  ipcRenderer.on('editResponse', (event, result) => {
    id.value = result.id
    name.value = result.name
    surname.value = result.surname
  })

  //Delete
  async function destroy(event) {
    await ipcRenderer.invoke('destroy', event.target.value)
  }

  //Register
  btnRegister = document.getElementById('btnRegister')
  btnRegister.onclick = createUpdate
  async function createUpdate() {
    let obj
    if (!id.value) {
      obj = { name: name.value, surname: surname.value }
      await ipcRenderer.invoke('create', obj)
    } else {
      obj = { id: id.value, name: name.value, surname: surname.value }
      await ipcRenderer.invoke('update', obj)
    }
  }
}
