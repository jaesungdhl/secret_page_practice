var express = require("express")
var mongoose = require("mongoose")
var User = require("./models/userModel");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
var expressSession = require("express-session");
var app = express();

mongoose.connect("mongodb://localhost:27017/secret_page", {useNewUrlParser:true});

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(expressSession({
  secret: "This is a secret between you and me.",
  resave: false,
  saveUninitialized: false
}))

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//==============//
//====Routes====//

//this takes you to the homepage
app.get("/", function(req, res) {
  res.render("home");
})

//this takes you to the secret page.
app.get("/secret", function(req, res) {
  res.render("secret");
})

//Authentication Routes
app.get("/login", function(req, res) {
  res.render("login");
})

app.get("/register", function(req, res) {
  res.render("register");
  console.log("register page entered")
})
app.post("/register", function(req, res) {
    console.log(req.body.username, req.body.password)
  User.register(new User(({
    username: req.body.username
  }), req.body.password, function(err, user) {
    if (err) {
          console.log("register post failed")
      return res.render("/register");
    }
    passport.authenticate("local")(req, res, function() {
          console.log("register post completed")
      res.redirect("/secret");
    })
  }))
})

app.listen(5000, function() {
  console.log("Your server has begun.")
})
