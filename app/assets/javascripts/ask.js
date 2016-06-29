$(function() {
  $('form.question').on('submit', makeQuestion)
})

function makeQuestion(ev) {
  // Bloquear post del formulario
  ev.preventDefault();
  // Borrar info anterior
  $('.error').html('')
  $('.response').html('')
  // Obtenemos la pregunta
  var question = $('textarea.question').val()
  var error = isQuestionValid(question)
  if (error) {
    questionError(error)
  } else {
    questionExecute(question)
  }
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
    data: {"question": question},
    success: function(result) {
      var html = '<h3>Respuesta</h3><p>' + result + '</p>'
      $('.response').html(html)
    },
    error: function(req, status, error) {
      var html = '<h4>La pregunta ingresada es inválida, intenta con otra pregunta...</h4>'
      $('.error').html(html)
    }
  });
}

function questionError(error) {
  var html = '<h3>La pregunta ingresada es inválida, intenta con otra pregunta...</h3>'
  $('.error').html(html)
}
