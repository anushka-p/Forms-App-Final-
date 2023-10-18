const passport = require('passport');

const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;

const GOOGLE_CLIENT_ID = '869338011687-tuivhusiauv9d02alanuk2k8rdtrj701.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID:     GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/gog/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
    
    return done(null, { ...profile, accessToken});
  }
));

passport.serializeUser(function(user, done){
    done(null, user);
});
passport.deserializeUser(function(user, done){
    done(null, user);
});