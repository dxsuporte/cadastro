$(document).ready(() => {
  'use strict'
  /* Inicio Funções*/

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
