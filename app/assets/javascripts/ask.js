$(function() {
  $('form.question').on('submit', makeQuestion)
  $('.question-fixed').on('click', makeQuestionFixed)
})

function makeQuestion(ev) {
  // Bloquear post del formulario
  ev.preventDefault()
  // Borrar info anterior
  questionProcessing()
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
    url: "/api/v1/question",
    data: {
      "question": question
    },
    success: function(result) {
      var html = '<h3>Respuesta</h3><center>'
      html += '<h4>Puntaje: ' + result['score'] + '</h4>'
      html += '<h4>Positivo: ' + result['pos'] + '%</h4>'
      html += '<h4>Negativo: ' + result['neg'] + '%</h4>'
      html += '<h4>Neutro: ' + result['neu'] + '%</h4>'
      html += '<h4>Intervalo de confianza: ' + result['confidence'] + '%</h4>'
      tweets = result['retweets']
      console.log(tweets);
      for (var i in tweets) {
        html += '<div class = "tweetbox">' + tweets[i].text + '</div>'
      }
      html += '</center>'
      $('.response').html(html)
    },
    error: function(req, status, error) {
      cleanResponse()
      var html = '<div class="alert"><span class="closebtn">&times;</span><h3>Hubo un error procesando la pregunta, intenta con otra pregunta. (3)</h3>' + error + '</div>'
      $('.error').html(html)
      $('.closebtn').on('click', cleanResponse)
    }
  })
}

function makeQuestionFixed() {
  questionProcessing()
  $.ajax({
    type: "POST",
    url: "/api/v1/question_fixed",
    success: function(result) {
      var html = '<h3>Respuesta - Chile está:</h3>'
      html += '<img class="emotion" src="/assets/' + result['response'] + '"/>'
      $('.response').html(html)
    },
    error: function(req, status, error) {
      cleanResponse()
      var html = '<div class="alert"><span class="closebtn">&times;</span><h3>Hubo un error procesando la pregunta, intenta con otra pregunta. (1)</h3>' + error + '</div>'
      $('.error').html(html)
      $('.closebtn').on('click', cleanResponse)
    }
  })
}

function questionProcessing() {
  cleanResponse()
  $('.response').html('<h4>Cargando...</h4>')
}

function questionError(error) {
  cleanResponse()
  var html = '<div class="alert"><span class="closebtn">&times;</span><h3>La pregunta ingresada es inválida, intenta con otra pregunta.</h3>  </div>'
  $('.error').html(html)
  $('.closebtn').on('click', cleanResponse)
}
