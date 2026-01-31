const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();



// Middleware-lər
app.use(cors());
app.use(express.json());

// Basic route test üçün
const authRoutes = require('./routes/auth/signUp');
app.use('/api/register', authRoutes);
const loginRoutes =  require('./routes/auth/login') ;
app.use('/', loginRoutes);

// Serveri işə sal
connectDB().then(() => {
  app.listen(3000, () => {
    console.log('Server is running on port 3000');
  });
});