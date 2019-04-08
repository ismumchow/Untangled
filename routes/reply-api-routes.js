
// Requiring our models
var db = require("../models");

// Routes
// =============================================================
module.exports = function(app) {

  // GET route for getting all of the posts
  app.get("/api/reply", function(req, res) {


    db.Post.findAll({

      include: [db.Author,db.Reply]
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });

  // Get route for retrieving a single post
  app.get("/api/reply/:id", function(req, res) {

    db.Reply.findOne({
      where: {
        id: req.params.id
      },
      include: [db.Author]
    }).then(function(dbPost) {
      res.json(dbPost);
    });
  });


  app.post("/api/reply", function(req, res) {
    db.Reply.create(req.body).then(function(dbPost) {
      res.json(dbPost);
      console.log("See Post: " + dbPost);
    });
  });


  // PUT route for updating posts
  app.put("/api/reply", function(req, res) {
    db.Reply.update(
      req.body,
      {
        where: {
          id: req.body.id
        }
      }).then(function(dbPost) {
      res.json(dbPost);
    });
  });
};
