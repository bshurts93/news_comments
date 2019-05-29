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
      $(textArea).val("");
    });
});

$(document).on("click", "#view-comments", function(e) {
  e.preventDefault();

  var thisId = $(this).attr("data-id");
  var commentBox = $("#comments-" + thisId);

  if ($(this).attr("data-state") === "hidden") {
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

    $(this).attr("data-state", "shown");
    $(this).html("<i class='far fa-comment'></i>Hide comments");
  } else if ($(this).attr("data-state") === "shown") {
    $(commentBox).empty();

    $(this).attr("data-state", "hidden");
    $(this).html("<i class='far fa-comment'></i>View comments");
  }
});

$(document).on("click", "#delete", function() {
  var userConfirm = confirm(
    "Are you sure you want to wipe the DB? All saved comments and articles will be lost."
  );

  if (userConfirm) {
    window.location.href = "/delete";
  }
  console.log(userConfirm);
});
