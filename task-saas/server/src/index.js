const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

const signUpRoutes = require('./routes/auth/signUp');
const loginRoutes = require('./routes/auth/login');

app.use('/api/signup', signUpRoutes);
app.use('/api/login', loginRoutes);

connectDB().then(() => {
  app.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
});
