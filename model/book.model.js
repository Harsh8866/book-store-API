const mongoose = require("mongoose");

const bookModel = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
  },
  author: {
    type: String,
    required: [true, "Author is required"],
    trim: true,
  },
  genre: {
    type: String,
    required: [true, "Genre is required"],
    trim: true,
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
  },
  stockquantity: {
    type: Number,
    required: [true, "Stock quantity is required"],
  },
  isdeleted: {
    type: Boolean,
    default: false,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
  createdby: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" },
});

const Book = mongoose.model("Book", bookModel);
module.exports = Book;
