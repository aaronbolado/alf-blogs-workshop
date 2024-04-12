const express = require('express');
const app = express();
const connectDb = require('./config/db');

//connecting to database
connectDb();

app.listen(8080, () => {
    console.log('Server is running in port 8080');
})