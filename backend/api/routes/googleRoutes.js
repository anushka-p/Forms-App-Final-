const router = require("express").Router();
const passport = require('passport');
const {handleGoogleCallback, handleProtectedRoute, getGoogleProfile, handleGoogleFailure,
handleLogout, getProfile}= require('../controllers/googleController');

function isLoggedIn(req,res,next){
  req.user.accessToken ? next() : res.sendStatus(401);
}

router.get('/', getGoogleProfile);
router.get('/auth/google', passport.authenticate('google', {scope: ['email', 'profile']}));
// router.get('/google/callback', handleGoogleCallback);
// router.get('/auth/failure', handleGoogleFailure);
// router.get('/protected', isLoggedIn, handleProtectedRoute);
// router.get('/logout', handleLogout);
// router.get('/profile', getProfile);

module.exports = router;
