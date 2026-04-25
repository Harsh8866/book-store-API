const { validationResult } = require("express-validator");
const fs = require("fs");
const path = require("path");

const sendResponse = require("../utils/APIResponse.js");
const Book = require("../model/book.model.js");
const BookImage = require("../model/bookimages.modal.js");

const allowedImage = ["image/png", "image/jpeg", "image/webp"];
const maxImageSize = 2;

async function getBooks(req, res) {
  let page = parseInt(req.query.page || 1);
  let limit = Math.min(req.query.limit || 20, 100);
  let skip = 0;
  if (page > 1) {
    skip = (page - 1) * limit;
  }
  const books = await Book.find({ isdeleted: false }).skip(skip).limit(limit);
  if (books.length > 0) {
    const fullUrl = `${req.protocol}://${req.get("host")}`;
    books.forEach(async (element) => {
      let bookData = {
        title: element.title,
        author: element.author,
        genre: element.genre,
        price: element.price,
        stock: element.stockquantity,
        images: [],
      };

      let BookImages = await BookImage.find({ refBookId: element._id }).select(
        "fileName",
      );
      BookImages.forEach((imageDetails) => {
        bookData.images.push(
          `${fullUrl}/public/bookimages/${imageDetails.fileName}`,
        );
      });
    })
  }
  return sendResponse(res, 200, { data: books, meta: { page, limit } });
}

async function createBook(req, res) {
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
  const { title, author, genre, price, stock } = req.body;
  if (!price || price < 0 || isNaN(price)) {
    return sendResponse(res, 400, { message: "valid book price is required" });
  }
  if (!stock || stock < 0 || isNaN(stock)) {
    return sendResponse(res, 400, {
      message: "valid stock quantity is required",
    });
  }

  let bookData = {
    title,
    author,
    genre,
    price,
    stockquantity: stock,
    createdby: req.user.id,
  };
  const book = new Book(bookData);
  const bookDetails = await book.save();
  return sendResponse(res, 201, bookDetails);
}
async function updateBook(req, res) {
  const bookId = req.params.id;
  let book = await Book.findById(bookId);
  if (!book || book.isdeleted) {
    return sendResponse(res, 404, { message: "Book is not exists" });
  }
  if (!req.body) {
    return sendResponse(res, 200, { message: "No any field for update" });
  }
  const { title, author, genre, price, stock } = req.body;
  let updateList = {};
  if (title != undefined && title != "") {
    updateList["title"] = title;
  }
  if (author != undefined && author != "") {
    updateList["author"] = author;
  }
  if (genre != undefined && genre != "") {
    updateList["genre"] = genre;
  }
  if (price != undefined) {
    if (price < 0 || isNaN(price)) {
      return sendResponse(res, 400, {
        message: "valid book price is required",
      });
    }
    updateList["price"] = price;
  }
  if (stock != undefined) {
    if (stock < 0 || isNaN(stock)) {
      return sendResponse(res, 400, {
        message: "valid stock quantity is required",
      });
    }
    updateList["stock"] = stock;
  }
  await Book.findByIdAndUpdate(bookId, updateList);
  return sendResponse(res, 201, {
    message: "Book details updated successfully",
  });
}

async function deleteBook(req, res) {
  const bookId = req.params.id;
  let book = await Book.findById(bookId);
  if (!book || book.isdeleted) {
    return sendResponse(res, 404, { message: "Book is not exists" });
  }
  await Book.findByIdAndUpdate(bookId, { isdeleted: true });
  return sendResponse(res, 201, {
    message: "Book deleted successfully",
  });
}

async function addImages(req, res) {
  const bookId = req.params.id;
  let book = await Book.findById(bookId);
  if (!book || book.isdeleted) {
    return sendResponse(res, 404, { message: "Book is not exists" });
  }
  if (!req.files) {
    return sendResponse(res, 400, {
      message: "Book images are required",
    });
  }

  let bookImages = await BookImage.find({ refBookId: bookId });
  let availableSlot = 5;
  let validSlot = true;
  if (bookImages.length > 0) {
    availableSlot -= bookImages.length;
  }
  let message = "";
  if (req.files.length > 5) {
    validSlot = false;
    message = "Only 5 images per book";
  }
  if (req.files.length > availableSlot) {
    validSlot = false;
    message = `Only ${availableSlot} slot left`;
    if (availableSlot == 0) {
      message = `No image slot availabe`;
    }
  }
  if (!validSlot) {
    req.files.forEach(async (element) => {
      await fs.unlinkSync(`${element.destination}/${element.filename}`);
    });
    return sendResponse(res, 400, { message });
  }

  let notvalid = false;
  let imageList = [];
  req.files.forEach((element) => {
    if (!allowedImage.includes(element.mimetype)) {
      notvalid = true;
      message = "Only jpeg, png and webp images are allowed";
    }
    let imageSize = (element.size / (1024 * 1024)).toFixed(2);
    if (imageSize > maxImageSize) {
      notvalid = true;
      message = "Max file size should be 2 mb";
    }
    imageList.push({ filename: element.filename, source: element.destination });
  });
  if (notvalid) {
    return sendResponse(res, 400, {
      message,
    });
  }
  if (imageList.length > 0) {
    let destination = path.resolve("public/bookimages");
    imageList.forEach(async (element) => {
      let addList = {};
      await fs.copyFileSync(
        `${element.source}/${element.filename}`,
        `${destination}/${element.filename}`,
      );
      await fs.unlinkSync(`${element.source}/${element.filename}`);
      addList["fileName"] = element.filename;
      addList["refBookId"] = bookId;
      if (req.body.displayorder && isNaN(req.body.displayorder)) {
        addList["displayorder"] = req.body.displayorder;
      }
      const bookImage = new BookImage(addList);
      const bookImageDetails = await bookImage.save();
    });
  }
  return sendResponse(res, 200, {
    message: "Images added successfully",
  });
}

async function deleteImage(req, res) {
  const bookId = req.params.id;
  const imageId = req.params.imageId;
  let bookImage = await BookImage.findOne({ refBookId: bookId, _id: imageId });
  if (!bookImage) {
    return sendResponse(res, 404, { message: "Book image not exists" });
  }
  await BookImage.findByIdAndDelete(bookImage._id);
  await fs.unlinkSync(
    path.resolve("public/bookimages") + "/" + bookImage.fileName,
  );
  return sendResponse(res, 200, { message: "Image deleted successfully" });
}
module.exports = {
  createBook,
  updateBook,
  deleteBook,
  addImages,
  deleteImage,
  getBooks,
};
