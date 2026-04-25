const mongoose = require("mongoose");

const reviewModel = new mongoose.Schema({
  refUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  refBookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Book",
  },
  rating: {
    type: Number,
    required: [true, "Rating is required"],
  },
  comment: {
    type: String,
    trim: true,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

const Review = mongoose.model("Order", reviewModel);
module.exports = Review;
