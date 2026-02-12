const express = require('express');
const mongoose = require('mongoose');
const app = express();
const cors = require('cors');
const connectDB = require('./config/db');
const PORT = process.env.PORT || 3001;

require('dotenv').config();

// Middleware
app.use(cors());
app.use(express.json());

const signUpRoutes = require('./routes/auth/signUp');
const loginRoutes = require('./routes/auth/login');
const tasksRoutes = require('./routes/tasks/index');

app.use('/api/signup', signUpRoutes);
app.use('/api/login', loginRoutes);
app.use('/api/tasks', tasksRoutes);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
