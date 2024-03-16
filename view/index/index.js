//Import
const { ipcRenderer } = require('electron')

//Variables
let tbody, btnRegister, btnEdit, btnDelete

window.onload = async () => {
  //Index
  await ipcRenderer.invoke('index')

  let id = document.getElementById('idproduct')
  let name = document.getElementById('name')
  let price = document.getElementById('price')

  //Table
  ipcRenderer.on('table', (event, obj) => {
    tbody = document.getElementById('tbody')
    obj.forEach((element) => {
      tbody.innerHTML += `<tr>
            <td>${element.name}</td>
            <td>${element.price}</td>
            <td>
            <button class="btn btn-primary mr-1 btnEdit" value="${element.id}">edit</button>
            <button class="btn btn-danger btnDelete" value="${element.id}">delete</button>
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
    const obj = [event.target.value]
    await ipcRenderer.invoke('edit', obj)
  }

  ipcRenderer.on('editResponse', (event, result) => {
    id.value = result.id
    name.value = result.name
    price.value = result.price
  })

  //Delete
  async function destroy(event) {
    const obj = [event.target.value]
    await ipcRenderer.invoke('destroy', obj)
    window.location.reload(true)
  }

  //Register
  btnRegister = document.getElementById('btnRegister')
  btnRegister.onclick = createUpdate
  async function createUpdate() {
    let obj
    if (!id.value) {
      obj = [name.value, price.value]
      await ipcRenderer.invoke('create', obj)
    } else {
      obj = [name.value, price.value, id.value]
      await ipcRenderer.invoke('update', obj)
    }
    window.location.reload(true)
  }
}
