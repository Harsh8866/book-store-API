const sendResponse = require("../utils/APIResponse.js");
const { validationResult } = require("express-validator");

const Book = require('../model/book.model.js');
const Order = require('../model/order.model.js');
const OrderProducts = require('../model/orderproducts.model.js');
const OrderAddress = require('../model/orderaddress.model.js'); 

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
  let orderDetails = {
    refUserId : req.user.id,
    totalPrice: bookExists.price * quantity
  }
  let order = new Order(orderDetails);
  order = await order.save();

  let orderProductsDetails = {
    refOrderId: order._id,
    refBookId: bookId,
    bookTitle: bookExists.title,
    bookAuthor: bookExists.author,
    unitPrice: bookExists.price,
    quantity: quantity,
    totalPrice: bookExists.price * quantity
  }
  let orderProducts = new OrderProducts(orderProductsDetails);
  orderProducts = await orderProducts.save();

  let orderAddressDetails = {
    refOrderId: order._id,
    customerName: fullName,
    PhoneNumber: phoneNumber,
    addressLine1: addressone,
    city: city,
    state: state,
    postcode: postcode,
    country: country
  }
  let orderAddress = new OrderAddress(orderAddressDetails);
  orderAddress = await orderAddress.save();

  return sendResponse(res, 200, {message: "Order placed successfully"});
}

module.exports = { createOrder };
