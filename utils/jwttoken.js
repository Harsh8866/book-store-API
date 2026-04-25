const jwt = require('jsonwebtoken');
require('dotenv').config();
const secret = process.env.SECRET || 'SECRET';

function generateToken(payload) {
    return jwt.sign(payload, secret);
}

function verifyToken(token) {
    return jwt.verify(token, secret);
}

function verifyAdminkey(key) {
    return process.env.ADMINKEY == key;
}

module.exports = {generateToken, verifyToken, verifyAdminkey}