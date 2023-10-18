const authServices = require('../services/authServices');
const bcrypt= require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator');
//function to implement signup functionality
const signup = async (req, res) => {
    const body = req.body;
    const name = body.username;
    if(validator.isEmail(body.useremail))
    {
      if(body.password.length < 6 ||body.password.toLowerCase().includes('password'))
      {
        return res.status(400).json({message:"Invalid Password format"})
      }
      if (/[&='+\-,<>?]/.test(name)) {
        return res.status(400).json({message:"Username cannot contain special characters: &,=,',+,-,<>,?"});
    }
      body.password =  await bcrypt.hash(body.password, 10);
      await authServices.createUser(body, (err, results) => {
        if (err) {
          return res.status(500).json({
            message: err.message,
          });
        }
        return res.status(200).json({
          data: results,
          message:'User created.'
        });
      });
    }
    else{
      res.status(400).json({message:"Invalid email format"});
    }
   
  };
  const googleLogin = async (req, res)=>{
    console.log(req.body);
    res.redirect('http://localhost:4200/home/user-home'); 
  }
// function to implement login functionality
  const login = async (req, res) => 
  {
    const body = req.body;
    // Verify user credentials using userServices
    await authServices.getUserByEmail(body.email, async (err, results) => {
      if (err) {
        return res.status(500).json({
          message: "User is not registered.",
        });
      }
    // Check if any user records were found
    if (!results.rows || results.rows.length === 0) {
      return res.status(401).json({ message: "Invalid email" });
    }
      // Compare the provided password with the hashed password
      const isPasswordMatch = await bcrypt.compare(
        body.password,
        results.rows[0].password
      );
      if (!isPasswordMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }
  
      // Generate a JWT token for authentication
      const token = jwt.sign(
        {
          email: body.email,
          user_id: results.rows[0].id,
          role: results.rows[0].role,
        },
        process.env.TOKEN_KEY,
        {
          expiresIn: "2h",
        }
      );
  
      // Return different responses based on user's role
      if (results.rows[0].role === 'admin') {
        return res.json({ message: "admin route", token: token });
      } else if (results.rows[0].role === 'user') {
        return res.json({ message: "user route", token: token });
      }
    });
  };
  
module.exports = { signup, login, googleLogin };