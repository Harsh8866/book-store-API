const express = require("express");
const { body } = require("express-validator");

const asyncHandler = require("../utils/asyncHandler.js");
const { registerUser, loginUser } = require("../controller/user.controller.js");

const router = express.Router();

router.post(
  "/register",
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 10 })
    .withMessage("Password must contain 8 character"),
  asyncHandler(registerUser),
);
router.post(
  "/login",
  body("email").isEmail().withMessage("Please enter a valid email address"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 10 })
    .withMessage("Password must contain 8 character"),
  asyncHandler(loginUser),
);

module.exports = router;
