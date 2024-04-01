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
  # Search Table
  --------------------------------------------------------------*/
  $('.search').keyup(() => {
    const searchSplit = $('.search').val().replace(/ /g, "'):containsi('")
    $.extend($.expr[':'], {
      containsi: function (elem, i, match, array) {
        return (elem.textContent || elem.innerText || '').toLowerCase().indexOf((match[3] || '').toLowerCase()) >= 0
      },
    })
    $('.results tbody tr')
      .not(`:containsi('${searchSplit}')`)
      .each(function (e) {
        $(this).attr('visible', 'false')
      })
    $(`.results tbody tr:containsi('${searchSplit}')`).each(function (e) {
      $(this).attr('visible', 'true')
    })
    const jobCount = $('.results tbody tr[visible="true"]').length
    $('.counter').text(jobCount <= 1 ? `${jobCount} item` : `${jobCount} itens`)
  })

  /* End of Functions */
})
