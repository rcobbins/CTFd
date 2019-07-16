// TODO: Replace this with CTFd JS library
$(document).ready(function() {
  $(".rfp-score-submission").click(function() {
    var elem = $(this)
      .parent()
      .parent();
//    var chal = elem.find(".chal").attr("id");
//    var chal_name = elem
//      .find(".chal")
//      .text()
//      .trim();
//    var team = elem.find(".team").attr("id");
//    var team_name = elem
//      .find(".team")
//      .text()
//      .trim();
    var score = elem.find(".rfp-score").val();
    var key_id = elem.find(".flag").attr("id");

    var td_row = $(this)
      .parent()
      .parent();
    if(score > 50) {
      ezal({
        title: "Whoops",
        body: "You should never have a score over 50 here!",
        button: "My bad"
      });
    }
    else {
      var params = {
          'score': score
      }

      CTFd.fetch("/api/v1/submissions/scorerfp/" + key_id, {
          method: "POST",
          credentials: 'same-origin',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(params)
      })
      .then(function(response) {
          return response.json();
      })
      .then(function(response) {
        if (response.success) {
          td_row.remove();
        }
        else {
          ezal({
            title: "Already reviewed",
            body: "Somebody already scored this one. Refresh your browser to get an updated list.",
            button: "OK"
         });
       }
      });
    }
  });
});
