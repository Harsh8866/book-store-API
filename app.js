const express = require("express");
const path = require("node:path");

const userRoute = require("./routes/user.route.js");
const bookRoute = require("./routes/book.route.js");
const orderRoute = require("./routes/order.route.js");
const sendResponse = require("./utils/APIResponse.js");

const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use("/api/auth", userRoute);
app.use("/api/books", bookRoute);
app.use("/api/order", orderRoute);

app.use((req, res) => {
  sendResponse(res, 404, "Page not found");
});

app.use((err, req, res, next) => {
    console.log(err);
    console.log('sdfdsf');
    return sendResponse(res, 500, "Internal Server error");
}) 
module.exports = app;
