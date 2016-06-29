$(function() {
  $('form.question').on('submit', makeQuestion)
})

function makeQuestion(ev) {
  // TODO: REVISAR CONTENIDO DE LA PREGUNTA
  var question = $('textarea.question').val()
  if isQuestionValid(question) {

  } else {

  }
  console.log(question);
  ev.preventDefault();
}

function isQuestionValid(question) {

}

function questionExecute(question) {

}

function questionError(error) {

}

// $.ajax({
//            type: "POST",
//            url: "/ask/respond", // the URL of the controller action method
//            data: ["question": $(".question").text], // optional data
//            success: function(result) {
//                 // do something with result
//            },
//            error : function(req, status, error) {
//                 // do something with error
//            }
//        });
