$(function() {
  $('form.question').on('submit', questionMake)
  $('form.versus').on('submit', versusMake)
  $('.question-fixed').on('click', makeQuestionFixed)
  $('.question-demo').on('click', function(ev) {
    questionProcessing()
    questionExecute(ev.target.innerHTML)
  })
})

// SINGLE QUESTION

function questionProcessing() {
  cleanResponse()
  $('.response').html('<h4>Cargando...</h4>')
}

function questionMake(ev) {
  ev.preventDefault()
  var question = $('textarea.question').val()
  var error = isQuestionValid(question)
  if (error) {
    questionError(error)
  } else {
    questionExecute(question)
  }
}

function questionExecute(question) {
  questionProcessing()
  $.ajax({
    type: "POST",
    url: "/api/v1/question",
    data: {
      "question": question
    },
    success: function(result) {
      var html = '<h3>Respuesta</h3>' + question + '<center>'
      html += '<br><br><div class= percentagebox>'
      html += '<meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css"><body class="w3-container">'
      html += '<h4>El estado emocional de tu pregunta es: ' + result['score'] + '</h4>'
      html += '<h10>Intervalo de confianza: ' + result['confidence'] + '%</h10>'
      html += ""
      html += '</div><br>'
      html += '<h3>Ahora un análisis más detallado del estado emocional...</h3>'
      html += '<div class= percentagebox>'
      html += '<h4>Tweets Positivos: ' + result['pos'] + '%</h4>'
      html += '<div class="w3-progress-container"><div id="myBar" class="w3-progressbar w3-green" style="width:' + result['pos'] + '%"><div class="w3-center w3-text-white">' + result['pos'] + '%</div></div></div><br>'
      html += twitter_button(question, 'Positivo', result['pos'])
      html += '<h4>Tweets Negativos: ' + result['neg'] + '%</h4>'
      html += '<div class="w3-progress-container"><div id="myBar" class="w3-progressbar w3-red" style="width:' + result['neg'] + '%"><div class="w3-center w3-text-white">' + result['neg'] + '%</div></div></div><br>'
      html += twitter_button(question, 'Negativo', result['neg'])
      html += '<h4>Tweets Neutros: ' + result['neu'] + '%</h4>'
      html += '<div class="w3-progress-container"><div id="myBar" class="w3-progressbar w3-light-blue" style="width:' + result['neu'] + '%"><div class="w3-center w3-text-white">' + result['neu'] + '%</div></div></div><br>'
      html += twitter_button(question, 'Neutro', result['neu']) + '</div><br>'
      html += '<h3>Quizás te interese saber cuales son los conceptos claves de tu pregunta...</h3>'
      html += '<br><div class= percentagebox>'
      concepts = result['key_concepts']
      k = 0
      for (var i in concepts) {
        if (k > 10) break
        html += '<p>' + concepts[i] + '</p>'
        k++
      }
      html += '</div>'
      html += '<div class=row><div class=col-md-6>'
      html += '<br><h3>5 Tweets más destacados</h3>'
      tweets = result['retweets']
      for (var i in tweets) {
        html += '<div class = "tweetbox">' + tweets[i].text + '</div>'
      }
      html += '</div>'
      clusters = result['clusters']
      console.log(clusters)
      html += '<div class=col-md-6>'
      html += '<br><h3> Twitter Opina:</h3>'
      for (var i in clusters) {
        console.log(i)
        html += '<div class = "tweetbox">' + clusters[i] + '</div>'
      }
      html += '</div></div>'
      html += '</center>'
      $('.response').html(html)
    },
    error: requestError
  })
}

// FIXED QUESTION

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
    error: requestError
  })
}

// VERSUS QUESTION

function versusProcessing() {
  cleanResponse()
  $('.response1').html('<h4>Cargando 1...</h4>')
  $('.response2').html('<h4>Cargando 2...</h4>')
  $('.response3').html('<h4>Cargando 3...</h4>')
}

function versusMake(ev) {
  ev.preventDefault()
  versusProcessing()
  var question1 = $('textarea.question1').val()
  var question2 = $('textarea.question2').val()
  var error1 = isQuestionValid(question1)
  var error2 = isQuestionValid(question2)
  if (error1) {
    questionError(error1)
  } else if (error2) {
    questionError(error2)
  } else {
    versusExecute(question1, question2)
  }
}

function versusExecute(question1, question2) {
  // question 1
  $.ajax({
    type: "POST",
    url: "/api/v1/question",
    data: {
      "question": question1
    },
    success: function(result) {
      var html = '<h3>Respuesta a: ' + question1 + '</h3><center>'
      html += '<br><br><div class= percentagebox>'
      html += '<meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css"><body class="w3-container">'
      html += '<h4>El estado emocional es: ' + result['score'] + '</h4>'
      html += '<h10>Intervalo de confianza: ' + result['confidence'] + '%</h10>'
      html += ""
      html += '</div><br>'
      html += '<h3>Un análisis más detallado:</h3>'
      html += '<div class= percentagebox>'
      html += '<h4>Positivo: ' + result['pos'] + '%</h4>'
      html += '<div class="w3-progress-container"><div id="myBar" class="w3-progressbar w3-green" style="width:' + result['pos'] + '%"><div class="w3-center w3-text-white">' + result['pos'] + '%</div></div></div><br>'
      html += '<h4>Negativo: ' + result['neg'] + '%</h4>'
      html += '<div class="w3-progress-container"><div id="myBar" class="w3-progressbar w3-red" style="width:' + result['neg'] + '%"><div class="w3-center w3-text-white">' + result['neg'] + '%</div></div></div><br>'
      html += '<h4>Neutro: ' + result['neu'] + '%</h4>'
      html += '<div class="w3-progress-container"><div id="myBar" class="w3-progressbar w3-light-blue" style="width:' + result['neu'] + '%"><div class="w3-center w3-text-white">' + result['neu'] + '%</div></div></div><br>'
      $('.response1').html(html)
    },
    error: requestError
  })
  // question 2
  $.ajax({
    type: "POST",
    url: "/api/v1/question",
    data: {
      "question": question2
    },
    success: function(result) {
      var html = '<h3>Respuesta a: ' + question2 + '</h3><center>'
      html += '<br><br><div class= percentagebox>'
      html += '<meta name="viewport" content="width=device-width, initial-scale=1"><link rel="stylesheet" href="http://www.w3schools.com/lib/w3.css"><body class="w3-container">'
      html += '<h4>El estado emocional es: ' + result['score'] + '</h4>'
      html += '<h10>Intervalo de confianza: ' + result['confidence'] + '%</h10>'
      html += ""
      html += '</div><br>'
      html += '<h3>Un análisis más detallado:</h3>'
      html += '<div class= percentagebox>'
      html += '<h4>Positivo: ' + result['pos'] + '%</h4>'
      html += '<div class="w3-progress-container"><div id="myBar" class="w3-progressbar w3-green" style="width:' + result['pos'] + '%"><div class="w3-center w3-text-white">' + result['pos'] + '%</div></div></div><br>'
      html += '<h4>Negativo: ' + result['neg'] + '%</h4>'
      html += '<div class="w3-progress-container"><div id="myBar" class="w3-progressbar w3-red" style="width:' + result['neg'] + '%"><div class="w3-center w3-text-white">' + result['neg'] + '%</div></div></div><br>'
      html += '<h4>Neutro: ' + result['neu'] + '%</h4>'
      html += '<div class="w3-progress-container"><div id="myBar" class="w3-progressbar w3-light-blue" style="width:' + result['neu'] + '%"><div class="w3-center w3-text-white">' + result['neu'] + '%</div></div></div><br>'
      $('.response2').html(html)
    },
    error: requestError
  })
  // 3 best tweets
  $.ajax({
    type: "POST",
    url: "/api/v1/question",
    data: {
      "question": question1 + ' ' + question2
    },
    success: function(result) {
      var html = '<br><h3>Analizandolos de manera conjunta, las palabras claves vendrían siendo...</h3><br><div class= percentagebox>'
      concepts = result['key_concepts']
      for (var i in concepts) {
        html += '<p>' + concepts[i] + '</p>'
      }
      html += '</div>'
      html += '<br><h3>Y los 5 tweets más destacados en relación a tu comparación son ...</h3>'
      tweets = result['retweets']
      for (var i in tweets) {
        html += '<div class = "tweetbox">' + tweets[i].text + '</div>'
      }
      html += '</center>'
      $('.response3').html(html)
    },
    error: requestError
  })
}

// GENERAL

function isQuestionValid(question) {
  if (question == "") {
    return "La pregunta está vacía"
  }
}

function cleanResponse() {
  $('.error').html('')
  $('.response').html('')
}

function questionInvalid() {
  cleanResponse()
  var html = '<div class="alert"><span class="closebtn">&times;</span><h3>La pregunta ingresada es inválida, intenta con otra pregunta.</h3>  </div>'
  $('.error').html(html)
  $('.closebtn').on('click', cleanResponse)
}

function requestError(req, status, error) {
  cleanResponse()
  var html = '<div class="alert"><span class="closebtn">&times;</span><h3>Hubo un error procesando tu pregunta, intenta más tarde o con otra pregunta.</h3>  </div>'
  $('.error').html(html)
  $('.closebtn').on('click', cleanResponse)
}

function twitter_button(question, measure, value) {
  var question2 = question.split('?').join('')
  return "<a href=\"https://twitter.com/intent/tweet?button_hashtag=" + measure + "&text=" + question2 + " " + value.toString() + " @Preguntame" + "\" class=\"twitter-hashtag-button\" data-size=\"large\" data-related=\"rtacuna\" data-url=\"http://preguntame.io\">Tweet</a> <script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0],p=/^http:/.test(d.location)?'http':'https';if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src=p+'://platform.twitter.com/widgets.js';fjs.parentNode.insertBefore(js,fjs);}}(document, 'script', 'twitter-wjs');</script>"
}
