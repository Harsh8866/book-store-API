const mongoose = require("mongoose");

const orderModel = new mongoose.Schema({
  refUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'shipped', 'delivered'],
    default: 'pending'
  },
  totalPrice: {
    type: Number,
    required: [true, "Price is required"],
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderModel);
module.exports = Order;
