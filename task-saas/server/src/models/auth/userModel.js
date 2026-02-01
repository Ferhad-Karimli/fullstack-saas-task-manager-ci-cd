const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    password: {
      type: String,
      required: true,
    },

    dateOfBirth: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = mongoose.model('User', userSchema);

module.exports = { UserSchema }; 
