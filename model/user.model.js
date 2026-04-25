const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const asyncHandler = require("../utils/asyncHandler.js");

const UserModel = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [10, "Password must be at least 6 characters long"],
        validate: {
        validator: (value) => {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).+$/.test(value);
        },
            message: 'Password must contain at least one uppercase letter, one lowercase letter, and one symbol.',
        },
    },
    role: {
        type: String,
        enum: ['customer', 'admin'],
        default: 'customer'
    },
    createdDate: {
        type: Date,
        default: Date.now
    }
});
UserModel.pre('save', async function () {
    if (!this.isModified('password')) { return }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});
UserModel.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', UserModel);
module.exports = User;