$(function() {
  $('form.question').on('submit', makeQuestion)
  $('form.versus').on('submit', makeVersus)
  $('.question-fixed').on('click', makeQuestionFixed)
  $('.question-demo').on('click', function(ev) {
    questionProcessing()
    questionExecute(ev.target.innerHTML)
  })
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

function makeVersus(ev) {
  // Bloquear post del formulario
  ev.preventDefault()
    // Borrar info anterior
  questionProcessing()
    // Obtenemos la pregunta
  var question1 = $('textarea.question1').val()
  var question2 = $('textarea.question2').val()
  var error1 = isQuestionValid(question1)
  var error2 = isQuestionValid(question2)
  if (error1){
    questionError(error1)
  }
  else {
    questionExecute(question1)
    //questionExecute(question2)
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
      html += '<br><br><div class= percentagebox>'
      html += '<meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css"><body class="w3-container">'
      html += '<h4>Puntaje: ' + result['score'] + '</h4>'
      html += '<h4>Intervalo de confianza: ' + result['confidence'] + '%</h4>'
      html += ""
      html += '</div><br>'
      html += '<div class= percentagebox>'
      html += '<h4>Positivo: ' + result['pos'] + '%</h4>'
      html += '<div class="w3-progress-container"><div id="myBar" class="w3-progressbar w3-green" style="width:' + result['pos'] + '%"><div class="w3-center w3-text-white">' + result['pos'] + '%</div></div></div><br>'
      html += twitter_button(question, 'Positivo', result['pos'])
      html += '<h4>Negativo: ' + result['neg'] + '%</h4>'
      html += '<div class="w3-progress-container"><div id="myBar" class="w3-progressbar w3-red" style="width:' + result['neg'] + '%"><div class="w3-center w3-text-white">' + result['neg'] + '%</div></div></div><br>'
      html += twitter_button(question, 'Negativo', result['neg'])
      html += '<h4>Neutro: ' + result['neu'] + '%</h4>'
      html += '<div class="w3-progress-container"><div id="myBar" class="w3-progressbar w3-light-blue" style="width:' + result['neu'] + '%"><div class="w3-center w3-text-white">' + result['neu'] + '%</div></div></div><br>'
      html += twitter_button(question, 'Neutro', result['neu']) + '</div>'
      html += '<br><div class= percentagebox><h4>Conceptos clave</h4>'
      concepts = result['key_concepts']
      for (var i in concepts) {
        html += '<p>' + concepts[i] + '</p>'
      }
      html += '</div>'
      html += '<br><h3>3 Best Tweets</h3>'
      tweets = result['retweets']
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

function twitter_button(question, measure, value) {
  var question2 = question.split('?').join('')
  return "<a href=\"https://twitter.com/intent/tweet?button_hashtag=" + measure + "&text=" + question2 + " " + value.toString() + " @Preguntame" + "\" class=\"twitter-hashtag-button\" data-size=\"large\" data-related=\"rtacuna\" data-url=\"http://preguntame.io\">Tweet</a> <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>"
}
