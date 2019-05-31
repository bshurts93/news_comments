// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");
var logger = require("morgan");

// Require models
var db = require("./models");

var PORT = process.env.PORT || 3000;

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
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/newsComments";

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true
});

// Routes
app.get("/", function(req, res) {
  res.redirect("/articles");
});

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
          if (
            $(element)
              .find("img")
              .attr("class") === "placeholder-image"
          ) {
            data.image =
              "https://pbs.twimg.com/profile_images/877265642742665216/sI-pwn-h_400x400.jpg";
          } else {
            data.image = $(element)
              .find("img")
              .attr("org-src");
          }
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
      res.render("index", { message: "Your Articles", articles: docs });
    }
  });
});

app.get("/delete", function(req, res) {
  db.Article.deleteMany({}, function(err, success) {
    if (err) {
      res.json(err);
    } else {
      res.render("index", {
        message: "Sucessfully wiped DB"
      });
    }
  });

  db.Comment.deleteMany({}, function(err, success) {
    if (err) {
      res.json(err);
    } else {
      console.log("success");
    }
  });
});

app.get("/delete-comment/:id", function(req, res) {
  db.Comment.deleteOne({ _id: req.params.id }).then(function(deleted) {
    res.json(deleted);
  });
});

app.post("/submit", function(req, res) {
  // Create a new Note in the db
  var articleId = req.body.articleId;
  var comment = req.body.comment;

  var data = {
    user: "Ben",
    text: comment
  };

  db.Comment.create(data)
    .then(function(dbComment) {
      return db.Article.findOneAndUpdate(
        { _id: articleId },
        { $push: { comments: dbComment._id } },
        { new: true }
      );
    })
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {
  db.Article.findOne({ _id: req.params.id })
    .populate("comments")
    .then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err) {
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});
