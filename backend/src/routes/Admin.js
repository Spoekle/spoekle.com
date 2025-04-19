const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');

const User = require('../models/userModel');
const authorizeRoles = require('./middleware/AuthorizeRoles');

router.post('/create-user', authorizeRoles(['admin']), async (req, res) => {
  try {
    const { username, password, roles, email } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      username,
      password: hashedPassword, 
      roles: roles || ['user'],
      email,
      status: 'active',
      createdAt: new Date()
    });
    await newUser.save();
    res.json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

router.put('/users/:id', authorizeRoles(['admin']), async (req, res) => {
  const { username, password, roles, email, profilePicture, status } = req.body;

  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    if (username) user.username = username;
    if (password) user.password = await bcrypt.hash(password, 10);
    if (roles) user.roles = roles;
    if (email !== undefined) user.email = email;
    if (profilePicture) user.profilePicture = profilePicture;
    if (status) user.status = status;

    // Update lastModified timestamp
    user.lastModified = new Date();

    await user.save();
    res.json({ message: 'User updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

router.get('/users/:id', authorizeRoles(['admin']), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});

router.get('/users', authorizeRoles(['admin']), async (req, res) => {
  try {
    const { role, status } = req.query;
    let query = {};
    
    if (role) {
      query.roles = role;
    }
    
    if (status) {
      query.status = status;
    }
    
    const users = await User.find(query).select('-password');
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
module.exports = router;