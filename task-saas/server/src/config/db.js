const mongoose = require('mongoose');
require('dotenv').config();

const authDb = {
  userName: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
};

const connectDb = async () => {
  try {
    await mongoose.connect(
      `mongodb+srv://${authDb.userName}:${authDb.password}@cluster0.nrqslz9.mongodb.net/`
    );
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDb;
