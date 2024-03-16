const { ipcRenderer } = require('electron')

let mylist, id, name, price, btnRegister, btnEdit, btnDelete

window.onload = function () {
  mylist = document.getElementById('mylist')
  id = document.getElementById('idproduct')
  name = document.getElementById('name')
  price = document.getElementById('price')
  btnRegister = document.getElementById('btnRegister')
  btnRegister.onclick = createUpdate
  index()
}

//Index
async function index() {
  await ipcRenderer.invoke('index')
}

//Index Response
ipcRenderer.on('indexResponse', (event, results) => {
  let template = ''
  const list = results
  list.forEach((element) => {
    template += `<tr>
            <td>${element.name}</td>
            <td>${element.price}</td>
            <td>
            <button class="btn btn-primary mr-1 btnEdit" value="${element.id}">edit</button>
            <button class="btn btn-danger btnDelete" value="${element.id}">delete</button>
            </td>
         </tr>`
  })
  mylist.innerHTML = template
  btnEdit = document.querySelectorAll('.btnEdit')
  btnEdit.forEach((boton) => {
    boton.addEventListener('click', edit)
  })
  btnDelete = document.querySelectorAll('.btnDelete')
  btnDelete.forEach((boton) => {
    boton.addEventListener('click', destroy)
  })
})

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

async function edit(event) {
  const obj = [event.target.value]
  await ipcRenderer.invoke('edit', obj)
}

ipcRenderer.on('editResponse', (event, result) => {
  id.value = result.id
  name.value = result.name
  price.value = result.price
})

async function destroy(event) {
  const obj = { id: parseInt(event.target.value) }
  await ipcRenderer.invoke('destroy', obj)
  window.location.reload(true)
}
