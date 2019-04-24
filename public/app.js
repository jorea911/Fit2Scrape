
$.getJSON("/articles", function(data) {
  // For each one
  for (var i = 0; i < 10; i++) {
    // Display the apropos information on the page
    $("#articles").append(
        "<div class='art'> <p class ='artTitle' data-id='"
         + data[i]._id + "'>" 
         + data[i].title + "</p> <p class = 'itemLink'>" 
         + data[i].link + "</p> <button type='button' data-id='"
         + data[i]._id + "' class='btn save-article' style='color: white; border: 1px white solid'>Save</button> </div>"
        );
        
  }
});

$.getJSON("/articles", function(data) {
    // For each one
    for (var i = 0; i < data.length; i++) {
      if (data[i].saveArticle ===true) {
        $(".saved-container").append(
          "<div class='item'> <p class ='itemTitle' data-id='"
           + data[i]._id + "'>" 
           + data[i].title + "</p> <p class = 'itemLink'>" 
           + data[i].link + "</p> <button type='button' data-id='"
           + data[i]._id + "' class='btn add-note' style='color: white; border: 1px white solid'>Add Note</button> </div>"
          );
    }
      }
      
  });

$(document).on("click", ".scrape", function() {
    console.log("clicked");
    location.href = "/scrape";
  });

  $(document).on("click", ".save-article", function(e) {
    e.preventDefault();
    var id = $(this).attr("data-id");

    $.ajax({
      method: "PUT", 
      url: "/update/articles/" + id,
    })
    .then(function (data) {
      console.log(data);
    })
    
    });




// Whenever someone clicks a p tag
$(document).on("click", ".add-note", function() {
    console.log("Save clicked")
  // Empty the notes from the note section
  $("#notes").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the note information to the page
    .then(function(data) {
      console.log(data);
      // The title of the article
      $("#notes").append("<h2>" + data.title + "</h2>");
      // An input to enter a new title
      $("#notes").append("<input id='titleinput' name='title' >");
      // A textarea to add a new note body
      $("#notes").append("<textarea id='bodyinput' name='body'></textarea>");
      // A button to submit a new note, with the id of the article saved to it
      $("#notes").append("<button data-id='" + data._id + "' id='savenote'>Save Note</button>");

      // If there's a note in the article
      if (data.note) {
        // Place the title of the note in the title input
        $("#titleinput").val(data.note.title);
        // Place the body of the note in the body textarea
        $("#bodyinput").val(data.note.body);
      }
    });
});

// When you click the savenote button
$(document).on("click", "#savenote", function() {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the note, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from title input
      title: $("#titleinput").val(),
      // Value taken from note textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function(data) {
      // Log the response
      console.log(data);
      // Empty the notes section
      $("#notes").empty();
    });

  // Also, remove the values entered in the input and textarea for note entry
  $("#titleinput").val("");
  $("#bodyinput").val("");
});
