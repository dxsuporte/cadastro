document.addEventListener('DOMContentLoaded', () => {
  /* Start Functions */

  /*--------------------------------------------------------------
  # Current date
  --------------------------------------------------------------*/
  const currentDate = () => {
    const DAY = String(new Date().getDate()).padStart(2, '0')
    const MONTH = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][new Date().getMonth()]
    const YEAR = new Date().getFullYear()
    document.getElementById('myDate').innerHTML = `${DAY} de ${MONTH} de ${YEAR}`
  }
  currentDate()

  /*--------------------------------------------------------------
  # Current time
  --------------------------------------------------------------*/
  const currentTime = () => {
    const myClock = new Date().toLocaleTimeString('pt-BR', { timeZone: 'America/Araguaina' })
    document.getElementById('myClock').innerHTML = myClock
  }
  setInterval(currentTime, 1000)

  /*--------------------------------------------------------------
  # Title DropDown
  --------------------------------------------------------------*/
  $(() => {
    $('[data-toggle="tooltip"]').tooltip()
  })

  /*--------------------------------------------------------------
  # FUNÇÃO DATATABLE
  --------------------------------------------------------------*/
  const dataTable = async () => {
    await $('.dataTable').dataTable({
      bJQueryUI: true,
      order: [],
      layout: {
        top1Start: ['buttons'],
      },
      buttons: [
        {
          extend: 'csv',
          text: '<i class="bi bi-database-fill-down"></i> CSV',
          titleAttr: 'CSV',
          className: 'btn btn-outline-primary btn-sm mt-2 mb-2',
          title: function () {
            return $('#dt-title').html()
          },
        },
        {
          extend: 'pdf',
          text: '<i class="bi bi-file-earmark-pdf-fill"></i> PDF',
          titleAttr: 'PDF',
          className: 'btn btn-outline-danger btn-sm mt-2 mb-2',
          title: function () {
            return $('#dt-title').html()
          },
        },
      ],
      lengthMenu: [
        [10, 25, 50, 100, -1],
        [10, 25, 50, 100, 'Todos'],
      ],
      bSort: true,
      bAutoWidth: false,
      oLanguage: {
        sProcessing: 'Processando...',
        sLengthMenu: "<span title='Resultados por página' aria-hidden='true'>_MENU_</span>",
        sZeroRecords: 'Não foram encontrados resultados para a sua pesquisa...',
        sInfo: 'Total de _MAX_ registros',
        sInfoEmpty: '',
        sInfoFiltered: '(filtrado _TOTAL_ registros)',
        sSearch: "<span title='Buscar' aria-hidden='true'>&#128270;</span>",
        oPaginate: {
          sNext: "<span aria-hidden='true'>&raquo;</span>",
          sPrevious: "<span aria-hidden='true'>&laquo;</span>",
        },
      },
      language: {
        emptyTable: 'Sem dados disponíveis na tabela',
      },
    })
  }
  setTimeout(dataTable, 150)

  /* End of Functions */
})
