const express = require("express");
const { body } = require("express-validator");

const { validateUser } = require("../middleware/auth.middleware.js");
const { upload } = require("../middleware/upload.middleware.js");
const {
  createBook,
  updateBook,
  deleteBook,
  addImages,
  deleteImage,
  getBooks
} = require("../controller/book.controller.js");
const asyncHandler = require("../utils/asyncHandler.js");

const router = express.Router();
router.get('/', asyncHandler(getBooks));

router.post(
  "/",
  validateUser,
  [
    body("title").notEmpty(),
    body("author").notEmpty(),
    body("genre").notEmpty(),
  ],
  asyncHandler(createBook),
);
router.patch("/:id", validateUser, asyncHandler(updateBook));
router.delete("/:id", validateUser, asyncHandler(deleteBook));

router.post('/:id/images', validateUser, upload.array('bookImage'), asyncHandler(addImages));
router.delete('/:id/images/:imageId', validateUser, asyncHandler(deleteImage));
module.exports = router;
