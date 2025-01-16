const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_KEY;
const adminUsername = process.env.ADMIN_USERNAME;
const mailEmail = process.env.MAIL_EMAIL;
const mailPassword = process.env.MAIL_PASSWORD;
const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');

const User = require('../models/userModel');
const authorizeRoles = require('./middleware/AuthorizeRoles');
const profilePictureUpload = require('./storage/ProfilePictureUpload');

// Get current user details
router.get('/me', authorizeRoles(['user', 'editor', 'uploader', 'admin']), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all users
router.get('/', authorizeRoles(['admin']), async (req, res) => {
    try {
        const users = await User.find({ username: { $ne: adminUsername } }).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ error: 'Invalid username or password' });

        if (user.status !== 'active') return res.status(403).json({ error: 'Account not active' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ error: 'Invalid username or password' });

        const token = jwt.sign({ id: user._id, username: user.username, roles: user.roles }, secretKey, { expiresIn: '1 day' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ id: newUser._id, username: newUser.username, roles: newUser.roles }, secretKey, { expiresIn: '1 day' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/resetPassword', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ error: 'Email is required' });

        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'User not found or no email linked' });

        const resetToken = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });
        const resetLink = `https://spoekle.com/reset-password?token=${resetToken}`;

        let transporter = nodemailer.createTransport({
            host: 'smtp.mail.me.com',
            port: 587, 
            secure: false, 
            auth: {
              user: mailEmail,
              pass: mailPassword
            },
            tls: {
              rejectUnauthorized: false
            }
          });

        await transporter.sendMail({
            from: 'noreply@spoekle.com',
            to: email,
            subject: 'Reset Your Spoekle.com Password',
            text: `Hi ${user.username},

You have requested to reset your password on Spoekle.com. Please click the link below to set a new password:

${resetLink}

If you did not request this, please ignore this email.

- Spoekle Team`
        });

        return res.json({ success: true, message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error('Error sending reset password email:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/resetPassword/confirm', async (req, res) => {
    try {
        const { token, password } = req.body;

        if (!token || !password) {
            return res.status(400).json({ error: 'Token and new password are required.' });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, secretKey);
        } catch (err) {
            return res.status(400).json({ error: 'Invalid or expired token.' });
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ error: 'User not found.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        await user.save();

        return res.json({ success: true, message: 'Password has been reset successfully. Redirecting...' });
    } catch (error) {
        console.error('Error resetting password:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/uploadProfilePicture', authorizeRoles(['user', 'editor', 'uploader', 'admin']), profilePictureUpload.single('profilePicture'), async (req, res) => {
    try {
        const profilePictureUrl = `https://api-main.spoekle.com/profilePictures/${req.file.filename}`;
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        if (user.profilePicture && !user.profilePicture.includes('profile_placeholder.png')) {
            const oldProfilePicturePath = path.join(__dirname, 'profilePictures', path.basename(user.profilePicture));
            if (fs.existsSync(oldProfilePicturePath)) {
                fs.unlinkSync(oldProfilePicturePath);
            }
        }

        user.profilePicture = profilePictureUrl;
        await user.save();

        res.json({ success: true, profilePictureUrl });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/:id', authorizeRoles(['user', 'editor', 'uploader', 'admin']), async (req, res) => {
    const { username, password, discordId, discordUsername, email } = req.body;
    const userId = req.user.id;

    if (userId !== req.params.id && !req.user.roles.includes('admin')) {
        return res.status(403).json({ error: 'Permission denied' });
    }

    try {
        const updateData = {};
        if (username) updateData.username = username;
        if (password) updateData.password = await bcrypt.hash(password, 10);
        if (discordId !== undefined) updateData.discordId = discordId;
        if (discordUsername !== undefined) updateData.discordUsername = discordUsername;
        if (email) updateData.email = email;

        await User.findByIdAndUpdate(req.params.id, updateData);
        res.json({ message: 'User updated successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Delete user
router.delete('/:id', authorizeRoles(['admin']), async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/approve', authorizeRoles(['admin']), async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.status = 'active';
        await user.save();

        res.json({ message: 'User approved successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.post('/disable', authorizeRoles(['admin']), async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.status = 'disabled';
        await user.save();

        res.json({ message: 'User disabled successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;