// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var logger = require("morgan");

// Require models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Set views engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

// Middleware

app.use(logger("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newsComments", {
  useNewUrlParser: true
});

// Routes

app.get("/scrape", function(req, res) {
  axios
    .get("https://www.reuters.com/news/archive/technologyNews")
    .then(function(response) {
      var $ = cheerio.load(response.data);

      var data = {};

      // For each element with a "title" class
      $(".news-headline-list")
        .first()
        .children()
        .each(function(i, element) {
          // Save the text and href of each link enclosed in the current element
          data.image = $(element)
            .find("img")
            .attr("org-src");
          data.title = $(element)
            .find("h3")
            .attr("class", "story-title")
            .text()
            .trim();
          data.link =
            "https://www.reuters.com" +
            $(element)
              .find("a")
              .attr("href");
          data.content = $(element)
            .find("p")
            .text()
            .trim();
          data.timestamp = $(element)
            .find("time")
            .text()
            .trim();

          // console.log("\r\n\r\n-------------------------------");
          // console.log(data);
          // console.log("-------------------------------");

          db.Article.create(data)
            .then(function(dbArticle) {
              console.log(dbArticle);
            })
            .catch(function(err) {
              console.log(err);
            });
        });
    });

  // Send a "Scrape Complete" message to the browser
  res.render("index", { message: "Scrape complete" });
});

app.get("/articles", function(req, res) {
  db.Article.find({}, function(err, docs) {
    if (err) {
      res.json(err);
    } else {
      res.render("index", { message: "Articles", articles: docs });
    }
  });
});

app.get("/delete", function(req, res) {
  // Remove a note using the objectID
  db.Article.deleteMany({}, function(err, success) {
    if (err) {
      res.json(err);
    } else {
      res.render("index", { message: "Sucessfully deleted articles" });
    }
  });
});

// // Route for grabbing a specific Article by id, populate it with it's note
// app.get("/articles/:id", function(req, res) {
//   // TODO
//   // ====
//   // Finish the route so it finds one article using the req.params.id,
//   // and run the populate method with "note",
//   // then responds with the article with the note included
//   db.Article.findOne({ _id: req.params.id })
//     .populate("note")
//     .then(function(doc) {
//       res.json(doc);
//     })
//     .catch(function(err) {
//       res.json(err);
//     });
// });

// // Route for saving/updating an Article's associated Note
// app.post("/articles/:id", function(req, res) {
//   // TODO
//   // ====
//   // save the new note that gets posted to the Notes collection
//   // then find an article from the req.params.id
//   // and update it's "note" property with the _id of the new note
//   db.Note.create(req.body)
//     .then(function(dbNote) {
//       return db.Article.findOneAndUpdate(
//         { _id: req.params.id },
//         { note: dbNote.id },
//         { new: true }
//       );
//     })
//     .then(function(dbArticle) {
//       // If the User was updated successfully, send it back to the client
//       res.json(dbArticle);
//     })
//     .catch(function(err) {
//       // If an error occurs, send it back to the client
//       res.json(err);
//     });
// });

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
