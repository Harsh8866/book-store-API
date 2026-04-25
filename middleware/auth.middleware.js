const sendResponse = require('../utils/APIResponse.js');
const { verifyToken } = require("../utils/jwttoken.js");

const validRole = ['admin'];
function validateUser(req, res, next) {
    if (!req.headers.authorization) {
        return sendResponse(res, 401, {message : "Unauthorized Access"});
    }
    const token = req.headers.authorization.replace('Bearer ', '');
    const validUser = verifyToken(token);
    if (!validUser) {
        return sendResponse(res, 401, {message : "Unauthorized Access"});
    }
    if (!validRole.includes(validUser.role)) {
        return sendResponse(res, 401, {message : "Unauthorized Access"});
    }
    req.user = validUser;
    return next();
}

function validateCustomer(req, res, next) {
    if (!req.headers.authorization) {
        return sendResponse(res, 401, {message : "Unauthorized Access"});
    }
    const token = req.headers.authorization.replace('Bearer ', '');
    const validUser = verifyToken(token);
    if (!validUser) {
        return sendResponse(res, 401, {message : "Unauthorized Access"});
    }
    if (!['customer'].includes(validUser.role)) {
        return sendResponse(res, 401, {message : "Unauthorized Access"});
    }
    req.user = validUser;
    return next();
}

module.exports = {validateUser, validateCustomer}