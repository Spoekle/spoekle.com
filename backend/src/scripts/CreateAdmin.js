const bcrypt = require('bcrypt');
const User = require('../models/userModel.js');

const adminUsername = process.env.ADMIN_USERNAME;
const adminPassword = process.env.ADMIN_PASSWORD;

const createAdminUser = async () => {
    try {
        const existingAdmin = await User.findOne({ username: adminUsername });
        let hashedPassword;
        if (!existingAdmin) {
            hashedPassword = await bcrypt.hash(adminPassword, 10);
            const adminUser = new User({
                username: adminUsername,
                password: hashedPassword,
                roles: ['admin'],
                status: 'active',
                profilePicture: 'https://ui-avatars.com/api/?background=random&color=fff&name=Admin'
            });
            await adminUser.save();
        } else {
            hashedPassword = await bcrypt.hash(adminPassword, 10);
            existingAdmin.password = hashedPassword;
            existingAdmin.roles = ['admin'];
            existingAdmin.status = 'active';
            existingAdmin.profilePicture = 'https://ui-avatars.com/api/?background=random&color=fff&name=Admin';
            await existingAdmin.save();
        }
    } catch (error) {
        console.error('Error creating admin user:', error);
    }
};

createAdminUser();