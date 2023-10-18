const express = require('express');
const adminRoutes = require('./adminRoutes');
const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const googleRoutes = require('./googleRoutes');
const router = express.Router();

// Use admin routes
router.use('/admin', adminRoutes);

// Use auth routes
router.use('/auth', authRoutes);

//Use user routes
router.use('/user', userRoutes);

//google auth routes
router.use('/gog', googleRoutes);

module.exports = router;