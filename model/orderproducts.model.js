const mongoose = require("mongoose");

const orderProductsModel = new mongoose.Schema({
  refOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  refBookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  bookTitle: {
    type: String,
    required: true,
    trim: true,
  },
  bookAuthor: {
    type: String,
    required: true,
    trim: true,
  },
  unitPrice: {
    type: Number,
    required: [true, "Unit Price is required"],
  },
  quantity: {
    type: Number,
    required: true,
  },
  totalPrice: {
    type: Number,
    required: [true, "Total Price is required"],
  },
});

const OrderProducts = mongoose.model("OrderProducts", orderProductsModel);
module.exports = OrderProducts;
