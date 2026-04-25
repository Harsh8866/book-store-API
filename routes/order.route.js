const express = require("express");
const { body } = require("express-validator");

const { validateCustomer } = require("../middleware/auth.middleware.js");
const { createOrder } = require("../controller/order.controller.js");

const router = express.Router();

router.post(
  "/",
  validateCustomer,
  [
    body("bookId").notEmpty(),
    body("quantity").notEmpty(),
    body("fullName").notEmpty(),
    body("phoneNumber").notEmpty(),
    body("addressone").notEmpty(),
    body("city").notEmpty(),
    body("state").notEmpty(),
    body("postcode").notEmpty(),
    body("country").notEmpty()
  ],
  createOrder,
);
module.exports = router;
