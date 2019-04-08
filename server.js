// *****************************************************************************
// Server.js - This file is the initial starting point for the Node/Express server.
//
// ******************************************************************************
// *** Dependencies
// =============================================================
var express = require("express");
require("dotenv").config();
var exphbs = require("express-handlebars");
var session = require("express-session");
var passport = require("passport");

// Sets up the Express App
// =============================================================
var app = express();
var PORT = process.env.PORT || 3000;

// Requiring our models for syncing
var db = require("./models");

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//Passport
app.use(
  session({
    secret: "rHUyjs6RmVOD06OdOTsVAyUUCxVXaWci",
    resave: true,
    saveUninitialized: true
  })
); // session secret

app.use(passport.initialize());
app.use(passport.session());

// Static directory

app.use(express.static("public"));
app.engine(
  "handlebars",
  exphbs({
    defaultLayout: "main"
  })
);
app.set("view engine", "handlebars");


// Routes
// =============================================================
require("./routes/html-routes.js")(app);
require("./routes/author-api-routes.js")(app);
require("./routes/post-api-routes.js")(app);
require("./routes/reply-api-routes.js")(app);
// --------------------------------
require("./routes/auth.js")(app, passport);
require("./config/passport/passport.js");

// Load passport strategies
require("./config/passport/passport.js")(passport, db.user);

var syncOptions = { force: false };

// Syncing our sequelize models and then starting our Express app
// =============================================================
db.sequelize.sync({ force: true }).then(function() {
  app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
  });
});
