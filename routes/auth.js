var db = require("../models");


module.exports = (app,passport) => {

  function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/signin");
  }

    app.get("/", (req, res) => {
        res.render("index");
      });
      // ----------Renders the blog-html, applies isLoggedIn form in conjunction with the passport.authenticate part below to make it all work--
      app.get("/blog-html",isLoggedIn, (req, res) => {
        res.render("blog");
      });
// ----------authenticates access to page only if logged in, applies isLoggedIn form in conjunction with the passport.authenticate part below to make it all work--
      app.post("/blog-html",passport.authenticate("local-signin", {
        successRedirect: "/blog-html",
        failureRedirect: "/signin"
      }));

      

      app.get("/cms-html",isLoggedIn, (req, res) => {
        res.render("cms");
      });

      app.get("/author-manager-html",isLoggedIn, function(req, res) {
        res.render("author");
      });

      app.get("/reply-html",isLoggedIn, function(req, res) {
        res.render("reply");
      });
      
    // -------------------------Passport Adds below------------------

  app.get("/home", isLoggedIn, (req, res) => {
    res.render("home");
  });
  
  app.get("/signup", (req, res) => {
    res.render("signup");
  });

  app.get("/signin", (req, res) => {
    res.render("signin");
  });

  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/signin",
      failureRedirect: "/signup"
    })
  );


  app.get("/logout", (req, res) => {
    req.session.destroy(err => {
      res.redirect("/");
      if (err) {
        throw err;
      }
    });
  });

  app.post(
    "/signin",
    passport.authenticate("local-signin", {
      successRedirect: "/blog-html",
      failureRedirect: "/signin"
    })
  );





  // Load index page
  app.get("/", function(req, res) {
    db.Example.findAll({}).then(function(dbExamples) {
      res.render("index", {
        msg: "Welcome!",
        examples: dbExamples
      });
    });
  });

  // Load create post page
  app.get("/new-post", (req, res) => {
    res.render("post");
  });

  // Load user profile page
  app.get("/view-profile/:username", isLoggedIn, function(req, res) {
    db.user
      .findOne({ where: { username: req.params.username } })
      .then(function(dbUser) {
        res.render("profile", {
          user: dbUser
        });
      });
  });

  // Load example page and pass in an example by id
  app.get("/example/:id", isLoggedIn, function(req, res) {
    db.Example.findOne({ where: { id: req.params.id } }).then(function() {
      dbExample;
      res.render("example", {
        example: dbExample
      });
    });
  });


 

  // app.get("/api/users/:id",isLoggedIn, function(req, res) {
  //   db.user.findOne({ where: { id: req.params.id } }).then(function(users) {
  //     res.json(users);
  //   });
  // });

  // app.get("/home", isLoggedIn, (req, res) => {
  //   console.log(req.user.username);
  //   res.render("home", { user: req.user.username, userId: req.user.id });
  // });

  // app.get("/api/users/",isLoggedIn, function(req, res) {
  //   db.user.findOne({ where: { id: req.params.username } }).then(function(users) {
  //     res.json(users);
  //   });
  // });
  app.get("/api/users/",isLoggedIn, function(req, res) {
    console.log(req.user.firstname);
    res.json(req.user);

  });

  app.get("/logout", (req, res) => {
    req.session.destroy(err => {
      res.redirect("/");
      if (err) {
        throw err;
      }
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function(req, res) {
    res.render("404");
  });
// --------------------------------------------- user data






}