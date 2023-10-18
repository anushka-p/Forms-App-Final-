const router = require("express").Router();
const {signup, login, googleLogin} =require('../controllers/authController');
router.post('/signup',signup);
router.post('/login', login);
router.post('/login-with-google', googleLogin)
module.exports=router;