const sendResponse = require("../utils/APIResponse.js");
const { validationResult } = require("express-validator");

const User = require("../model/user.model.js");
const { generateToken, verifyAdminkey } = require("../utils/jwttoken.js");

async function registerUser(req, res) {
  const bodyValidation = validationResult(req);
  if (!bodyValidation.isEmpty()) {
    return sendResponse(res, 400, { message: bodyValidation.errors[0].msg });
  }

  const { name, email, password } = req.body;
  const existUser = await User.findOne({ email });
  if (existUser) {
    return sendResponse(res, 400, {
      message: "User already exist with this email",
    });
  }
  let userDetails = { name, email, password };
  if (req.body.adminKey) {
    let validKey = verifyAdminkey(req.body.adminKey);
    if (validKey) userDetails['role'] = 'admin';
  }
  const user = new User(userDetails);
  const result = await user.save();
  return sendResponse(res, 201, result);
}

async function loginUser(req, res) {
  const bodyValidation = validationResult(req);
  if (!bodyValidation.isEmpty()) {
    return sendResponse(res, 400, bodyValidation.errors[0].msg);
  }

  const { email, password } = req.body;

  const existUser = await User.findOne({ email });
  if (!existUser) {
    return sendResponse(res, 400, {
      message: "User not exist with this email",
    });
  }
  const isPasswordMatch = await existUser.comparePassword(password);
  if (!isPasswordMatch) {
    return sendResponse(res, 401, { message: "Invalid email or password" });
  }
  const payload = {
    id: existUser._id,
    name: existUser.name,
    email: existUser.email,
    role: existUser.role,
  };

  const token = generateToken(payload);
  return sendResponse(res, 200, { message: "Login success", token });
}

module.exports = { registerUser, loginUser };
