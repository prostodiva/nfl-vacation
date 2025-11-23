const Admin = require('../models/Admin');

const createAdmin = async (email, password) => {
    try {
        const admin = await Admin.create({ email, password });
        return admin;
    } catch (error) {
        throw error;
    }
};

const loginAdmin = async (email, password) => {
    try {
        const admin = await Admin.findOne({ email });
        if (admin && admin.password === password) {
            return { id: admin._id, email: admin.email };
        }
        return null;
    } catch (error) {
        throw error;
    }
};

module.exports = { createAdmin, loginAdmin };