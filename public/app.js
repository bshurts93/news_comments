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

  console.log(textArea);

  console.log(thisId);

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
      // // Log the response
      // console.log(data);
      // // Empty the notes section
      // $("#notes").empty();
    });

  // // Also, remove the values entered in the input and textarea for note entry
  // $("#titleinput").val("");
  // $("#bodyinput").val("");
});
