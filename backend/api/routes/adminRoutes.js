const router = require("express").Router();
const {verifyToken, verifyAdmin} = require('../../middlewares/token');
const {getAll, addNewForm, getForm, updateForm, deleteForm, addNewUserFormSubmission, getSubmittedForm, formControlResponse, otherFormSubmission}
 = require('../controllers/adminController');
router.get('/view-all',verifyToken,verifyAdmin, getAll);
router.post('/add-form', verifyToken, verifyAdmin, addNewForm);
router.get('/form/:id', verifyToken, getForm);
router.get('/form', verifyToken, getForm);
// router.patch('/form/:id', verifyToken, verifyAdmin, updateForm);
router.patch('/delete-form/:formid', verifyToken, deleteForm); 
router.post('/submit-new-form/:id', verifyToken, addNewUserFormSubmission)
router.get('/get-submitted-forms/:userid', verifyToken, getSubmittedForm)//register endpoint
router.get('/get-submitted-formcontrol/:userid/:formid', verifyToken, formControlResponse)
router.get('/other-submissions/:id', verifyToken, otherFormSubmission)

module.exports=router;