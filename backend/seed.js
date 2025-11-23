const mongoose = require('mongoose');
const Admin = require('./models/Admin');

mongoose.connect('mongodb://localhost:27017/nfl-vacation')
    .then(async () => {
        const existingAdmin = await Admin.findOne();
        if (existingAdmin) {
            console.log('Admin already exists');
            process.exit(0);
        }

        await Admin.create({
            email: 'admin@test.com',
            password: '11111111'
        });
        
        console.log('Admin created successfully');
        process.exit(0);
    })
    .catch(err => {
        console.error('Error:', err);
        process.exit(1);
    });