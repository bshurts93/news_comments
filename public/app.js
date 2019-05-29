// When you click the savenote button
$(document).on("click", "#add-comment", function(e) {
  e.preventDefault();
  // Grab the id associated with the article from the submit button
  var thisId = $(this)
    .parent()
    .attr("data-id");

  var textArea = $(this)
    .parent()
    .find("textarea")
    .val();

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    // url: "/articles/" + thisId,
    url: "/submit",
    data: {
      articleId: thisId,
      comment: textArea
    }
  })
    // With that done
    .then(function(data) {
      console.log(data);
    });

  $("#comment-field").val("");
});

$(document).on("click", "#view-comments", function(e) {
  e.preventDefault();

  var thisId = $(this).attr("data-id");
  var commentBox = $("#comments-" + thisId);

  console.log(commentBox);

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(function(data) {
    var comments = data.comments;

    comments.forEach(element => {
      var newComment = $("<div>").addClass("comment");

      var text = $("<p>").text(element.text);

      newComment.append(text);

      $(commentBox).append(newComment);
    });
  });
});
