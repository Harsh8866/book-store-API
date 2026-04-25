const mongoose = require("mongoose");

const bookImageModel = new mongoose.Schema({
    refBookId : {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Book"
    },
    fileName: {
        type: String,
        required : true
    },
    displayorder: {
        type: Number,
        default: 0
    },
    uploadDate: {
        type: Date,
        default: Date.now
    }
});

const BookImage = mongoose.model("bookImageModel", bookImageModel);
module.exports = BookImage;