const passport = require('passport');
const axios = require('axios');
const authServices = require('../services/authServices');

function isLoggedIn(req,res,next){
    req.user.accessToken ? next() : res.sendStatus(401);
}

function getGoogleProfile(req,res){
    if(req.isAuthenticated()){
        console.log('Google User Profile:', req.user);
       res.json({"message":`Hello ${req.user.displayName}! <a href="/logout">Logout</a>`});
    }
    else{
        res.redirect('http://localhost:3000/gog/auth/google');
    }
}

function handleGoogleCallback(req, res) {
    passport.authenticate('google', (err, user, info) => {
        if (err) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }

        if (!user) {
            return res.status(401).json({ message: 'Authentication Failed' });
        }

        // If authentication succeeds, you can send a success response
        return res.status(200).json({ message: 'Authentication Successful', user });
    })(req, res);
}

function handleGoogleFailure(req,res){
    res.send('something went wrong');
}

async function handleProtectedRoute(req,res){
    const googleEmail= req.user.email;
    try {
        await authServices.getUserByEmail(googleEmail, (err, results)=>{
            if(err)
            {
                console.log(err);
            }
        if (!results.rows || results.rows.length === 0) {
             authServices.createUserFromGoogle(req.user);
        }
        res.send(`hello ${req.user.displayName}`);
        });
        
    } catch (err) {
        console.error('Error checking user:', err);
        res.status(500).json({
            message: 'Error checking user.',
        });
    }
}

function handleLogout(req,res){
    req.session.destroy();
    res.clearCookie('connect.sid');
    res.send('Byeee!!');
}

function getProfile(req, res) {
    if (req.isAuthenticated()) {
        const accessToken = req.user.accessToken;
        axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        .then(response => {
            const userProfile = response.data;
            res.json({ userProfile });
        })
        .catch(error => {
            console.error('Error fetching user profile:', error);
            res.status(500).json({ error: 'Failed to fetch user profile' });
        });
    } else {
        res.status(401).json({ error: 'Not authenticated' });
    }
}

module.exports = {
    isLoggedIn,
    getGoogleProfile,
    handleGoogleCallback,
    handleGoogleFailure,
    handleProtectedRoute,
    handleLogout,
    getProfile,
};
