const router = require("express").Router();
const {verifyToken, verifyUser} = require('../../middlewares/token');
const {getUser, updateUser, deleteUser} = require('../controllers/userController');
router.get('/get-user/:id', verifyToken, getUser);
router.patch('/update-user/:id',verifyToken,updateUser);
router.delete('/delete/:id',verifyToken,deleteUser)
module.exports=router;