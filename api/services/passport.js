var passport = require('passport'),
GoogleStrategy = require('passport-google-oauth20').Strategy,
bcrypt = require('bcrypt');

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findOne({ id: id } , function (err, user) {
        done(err, user);
    });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "http://xcourse.co/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, cb) {

    if(profile._json.domain === 'theironyard.com') {

      var user = {
        name: profile.displayName,
        email: profile.emails[0].value,
        authProvider: 'Google',
        googleId: profile.id
      }
      User.findOrCreate(user, function (err, user) {
        return cb(err, user);
      });

    } else {
      return cb("Invalid host domain");
    }

  }
));

module.exports = {};
