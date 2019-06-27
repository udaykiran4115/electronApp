var User = require("./user");
var os = require("os");
var fullname = require("fullname");
var userdetails = require("username");

var userName = os.userInfo().username;

module.exports = function(app, passport) {
  app.get("/", function(req, res) {
    res.render("index.ejs");
  });

  app.get("/login", function(req, res) {
    res.render("login.ejs", { message: req.flash("loginMessage") });
  });

  app.post(
    "/login",
    passport.authenticate("local-login", {
      successRedirect: "/profile",
      failureRedirect: "/login",
      failureFlash: true
    })
  );

  app.get("/system-login", function(req, res) {
    res.render("system-login.ejs", { message: req.flash("signupMessage") });
  });

  app.post("/system-login", function(req, res) {
    console.log("userName");
    console.log(userName);

    User.findOne({ username: "uday_kiran" }, function(err, doc) {
      let newUser = new User();
      newUser.username = doc.username;
      newUser.firstname = doc.firstName;
      newUser.lastname = doc.lastName;
      if (doc) {
        console.log("Success");
        res.render("profile.ejs", { user: newUser });
      } else {
        console.log("Failed");
      }
    });
  });

  app.get("/signup", function(req, res) {
    res.render("signup.ejs", { message: req.flash("signupMessage") });
  });

  app.post(
    "/signup",
    passport.authenticate("local-signup", {
      successRedirect: "/",
      failureRedirect: "/signup",
      failureFlash: true
    })
  );

  app.get("/profile", isLoggedIn, function(req, res) {
    res.render("profile.ejs", { user: req.user });
  });

  // app.get('/profile', function(req, res){
  //   res.render('profile.ejs', { user: req.user});
  // });

  app.get("/:username/:password", function(req, res) {
    var newUser = new User();
    newUser.username = req.params.username;
    newUser.password = req.params.password;
    console.log(newUser.username + " " + newUser.password);
    newUser.save(function(err) {
      if (err) throw err;
    });
    res.send("Success!");
  });

  app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/");
  });
};

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/login");
}
