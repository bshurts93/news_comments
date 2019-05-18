// Dependencies
var express = require("express");
var exphbs = require("express-handlebars");
var axios = require("axios");
var cheerio = require("cheerio");
var mongoose = require("mongoose");

// Exress server
var app = express();

// Database config
var databaseUrl = "news_comments";
var collections = ["scrapedData"];

// Article Model
var Article = require("./articleModel");

// Root
app.get("/", function(req, res) {
  res.send("Home");
});

// Get all from DB
app.get("/all", function(req, res) {
  db.scrapedData.find({}, function(err, docs) {
    if (err) {
      console.log(err);
    } else {
      res.json(docs);
    }
  });
});

// Scrape data from one site and place it into the mongodb db
app.get("/scrape", function(req, res) {
  // Make a request via axios for the news section of `ycombinator`
  axios
    .get("https://www.reuters.com/news/archive/technologyNews")
    .then(function(response) {
      // Load the html body from axios into cheerio
      var $ = cheerio.load(response.data);

      // For each element with a "title" class
      $("article.story").each(function(i, element) {
        // Save the text and href of each link enclosed in the current element
        var title = $(element)
          .find("h3")
          .attr("class", "story-title")
          .text()
          .trim();
        var content = $(element)
          .find("p")
          .text()
          .trim();
        console.log(
          "----------------------------------------------------------------------------"
        );
        console.log("Title: " + title);
        console.log("Content: " + content);
        console.log(
          "----------------------------------------------------------------------------\r\n\r\n"
        );
      });
    });

  // Send a "Scrape Complete" message to the browser
  res.send("Scrape Complete");
});

// Listen on port 3000
app.listen(3000, function() {
  console.log("App running on port 3000!");
});
