document.addEventListener('DOMContentLoaded', () => {
  /* Inicio Funções*/

  /*--------------------------------------------------------------
  # Variables
  --------------------------------------------------------------*/
  const myDia = String(new Date().getDate()).padStart(2, '0')
  const myMesEx = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'][new Date().getMonth()]
  const myAno = new Date().getFullYear()

  /*--------------------------------------------------------------
  # Date Footer
  --------------------------------------------------------------*/
  document.getElementById('myDate').innerHTML = `${myDia} de ${myMesEx} de ${myAno}`

  /*--------------------------------------------------------------
  # Clock Footer
  --------------------------------------------------------------*/
  setInterval(myTimer, 1000)
  function myTimer() {
    const newDate = new Date()
    const datePtBr = newDate.toLocaleTimeString('pt-BR', {
      timeZone: 'America/Araguaina',
    })
    document.getElementById('myClock').innerHTML = datePtBr
  }

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

  /**Fim Funções */
})
