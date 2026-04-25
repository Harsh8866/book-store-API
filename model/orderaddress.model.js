const mongoose = require("mongoose");

const orderAddressModel = new mongoose.Schema({
  refOrderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
  },
  customerName: {
    type: String,
    required: [true, "Customer name is required"],
    trim: true,
  },
  PhoneNumber : {
    type: String,
    require: [true, "Phonenumber is required"],
  },
  addressLine1: {
    type: String,
    required: [true, "Address Line 1 is required"],
    trim: true,
  },
  addressLine2: {
    type: String,
    trim: true,
  },
  city: {
    type: String,
    required: [true, "City name is required"],
    trim: true,
  },
  state: {
    type: String,
    required: [true, "State name is required"],
    trim: true,
  },
  postcode: {
    type: Number,
    required: [true, "Postcode is required"],
  },
  country: {
    type: String,
    required: [true, "Country name is required"],
  },
  addressType: {
    type: String,
    enum: ['billing', 'shipping'],
    default: 'shipping'
  },
});

const OrderAddress = mongoose.model("OrderAddress", orderAddressModel);
module.exports = OrderAddress;
