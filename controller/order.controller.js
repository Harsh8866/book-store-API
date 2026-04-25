const sendResponse = require("../utils/APIResponse.js");
const { validationResult } = require("express-validator");

const Book = require('../model/book.model.js');

async function createOrder(req, res) {
  const bodyValidation = validationResult(req);
  if (!bodyValidation.isEmpty()) {
    let requiredField = [];
    bodyValidation.array().forEach((element) => {
      requiredField.push(element.path);
    });
    return sendResponse(res, 400, {
      message: `${requiredField.join(", ")} is required`,
    });
  }
  const {bookId, quantity, fullName, phoneNumber, addressone, city, state, postcode, country} = req.body;
  const bookExists = await Book.findById(bookId);
  if (!bookExists || bookExists.isdeleted ) {
    return sendResponse(res, 200, {message: "Book not exists"});
  }
  if (quantity > bookExists.stockquantity) {
    return sendResponse(res, 200, {message: "Insufficient stock"});
  }
  
  

  return sendResponse(res, 200, {});
}

module.exports = { createOrder };
