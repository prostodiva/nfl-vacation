
const express = require('express');
const router = express.Router();
const Admin = require('../models/Admin');
const { createAdmin, loginAdmin } = require('../controllers/adminService');

router.post('/create', async (req, res) => {
    try {
        // Check existing admin
        const existingAdmin = await Admin.findOne();
        if (existingAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Admin already exists'
            });
        }

        // Check setup key
        const { email, password, setupKey } = req.body;
        if (setupKey !== process.env.ADMIN_SETUP_KEY) {
            return res.status(403).json({
                success: false,
                message: 'Invalid setup key'
            });
        }

        const admin = await createAdmin(email, password);
        res.status(201).json({ 
            success: true, 
            admin: { id: admin._id, email: admin.email } 
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating admin',
            error: error.message
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await loginAdmin(email, password);
        
        if (admin) {
            res.json({ success: true, admin });
        } else {
            res.status(401).json({ 
                success: false, 
                message: 'Invalid credentials' 
            });
        }
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: 'Server error' 
        });
    }
});


module.exports = router;