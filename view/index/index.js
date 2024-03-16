//Import
const { ipcRenderer } = require('electron')

window.onload = async () => {
  //Index
  await ipcRenderer.invoke('index')

  //Imputs
  let id = document.getElementById('idProduct')
  let name = document.getElementById('name')
  let surname = document.getElementById('surname')

  //Table
  ipcRenderer.on('table', async (event, obj) => {
    let tbody = document.getElementById('tbody')
    await obj.forEach((event) => {
      tbody.innerHTML += `<tr>
            <td>${event.name}</td>
            <td>${event.surname}</td>
            <td>
            <div class="btn-group">
            <button class="btn btn-primary btn-sm btnEdit" value="${event.id}"><i class="bi bi-pencil-fill"></i> Editar</button>
            <button class="btn btn-danger btn-sm btnDelete" value="${event.id}"> <i class="bi bi-trash-fill"></i> Excluir</button>
            </div>            
            </td>
         </tr>`
    })
    //Edit
    let btnEdit = document.querySelectorAll('.btnEdit')
    btnEdit.forEach((boton) => {
      boton.addEventListener('click', edit)
    })
    //Delete
    let btnDelete = document.querySelectorAll('.btnDelete')
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
  const btnRegister = document.getElementById('btnRegister')
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
