$(function() {
  $('form.question').on('submit', makeQuestion)
})

var test = function() {
  console.log('test');
}

function makeQuestion(ev) {
  // TODO: REVISAR CONTENIDO DE LA PREGUNTA
  var question = $('textarea.question').val()
  console.log(question);
  ev.preventDefault();
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
