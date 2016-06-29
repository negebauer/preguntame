$(function() {
  $('form.question').on('submit', makeQuestion)
})

function makeQuestion(ev) {
  // Bloquear post del formulario
  ev.preventDefault()
  // Borrar info anterior
  cleanResponse()
    // Obtenemos la pregunta
  var question = $('textarea.question').val()
  var error = isQuestionValid(question)
  if (error) {
    questionError(error)
  } else {
    questionExecute(question)
  }
}

function cleanResponse() {
  $('.error').html('')
  $('.response').html('')
}

function isQuestionValid(question) {
  if (question == "") {
    return "La pregunta está vacía"
  }
}

function questionExecute(question) {
  $.ajax({
    type: "POST",
    url: "/ask/respond",
    data: {
      "question": question
    },
    success: function(result) {
      var html = '<h3>Respuesta</h3><p>' + result + '</p>'
      $('.response').html(html)
    },
    error: function(req, status, error) {
      var html = '<div class="alert"><span class="closebtn">&times;</span><h4>La pregunta ingresada es inválida, intenta con otra pregunta...</h4>' + error + '</div>'
      $('.error').html(html)
      $('.closebtn').on('click', cleanResponse)
    }
  });
}

function questionError(error) {
  var html = '<div class="alert"><span class="closebtn">&times;</span><h4>La pregunta ingresada es inválida, intenta con otra pregunta...</h4>  </div>'
  $('.error').html(html)
  $('.closebtn').on('click', cleanResponse)
}
