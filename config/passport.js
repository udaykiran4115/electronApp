var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var WindowsStrategy = require("passport-windowsauth");

var User = require("../app/user");

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  //   passport.use(new WindowsStrategy({
  //     integrated: true
  // }, function(profile,done) {
  //     var user = {
  //       usernameField: profile.id,

  //     };
  //     done(null, user);
  // }));

  passport.use(
    "local-signup",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, email, password, done) {
        process.nextTick(function() {
          User.findOne({ username: email }, function(err, user) {
            if (err) return done(err);
            if (user) {
              return done(
                null,
                false,
                req.flash("signupMessage", "That email already taken")
              );
            } else {
              var newUser = new User();
              newUser.username = email;
              newUser.password = newUser.generateHash(password);

              newUser.save(function(err) {
                if (err) throw err;
                return done(null, newUser);
              });
            }
          });
        });
      }
    )
  );

  passport.use(
    "local-login",
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
        passReqToCallback: true
      },
      function(req, email, password, done) {
        process.nextTick(function() {
          User.findOne({ username: email }, function(err, user) {
            if (err) return done(err);
            if (!user)
              return done(
                null,
                false,
                req.flash("loginMessage", "No User found")
              );
            console.log(password);
            if (!user.validPassword(password)) {
              return done(
                null,
                false,
                req.flash("loginMessage", "invalid password")
              );
            }
            return done(null, user);
          });
        });
      }
    )
  );

  //   passport.use(new WarwickSSOStrategy({
  //     consumerKey: WARWICK_SSO_CONSUMER_KEY,
  //     consumerSecret: WARWICK_SSO_CONSUMER_SECRET,
  //     callbackURL: "http://127.0.0.1:3000/auth/warwick-sso/callback"
  //   },
  //   function(token, tokenSecret, profile, done) {
  //     User.findOrCreate({ warwickUniversityId: profile.id }, function (err, user) {
  //       return done(err, user);
  //     });
  //   }
  // ));
};
