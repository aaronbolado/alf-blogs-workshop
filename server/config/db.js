const mongoose = require('mongoose');
// db here

const connectDb = async () => {
    try {
        await mongoose.connect('mongodb+srv://aaronjohnbolado:QQlNejAU6NlPXA3b@cluster0.wfeebhy.mongodb.net/');
        console.log('Connection to Database: Success');
    } catch (error) {
        console.log(error);
    }
}

module.exports = connectDb;