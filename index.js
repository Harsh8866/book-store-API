const mongoose = require('mongoose');
const app = require('./app.js');
require('dotenv' ).config();

// Database connection and server start logic
mongoose.connect(process.env.DBURL).then(() => {
    console.log("DB Connected");
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
}).catch((err) => {
    console.log("DB Connection faile", err.message);
})


