const { default: mongoose, Schema } = require('mongoose');
const Joi = require('joi');
const { type } = require('express/lib/response');

const Schema = mongoose.Schema({
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
});

const LoginValidate = (data) => {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    password: Joi.string().min(6).max(50).required(),
    email: Joi.string().email().required(),
  });
  return schema.validate(data);
};

const LoginSchema = mongoose.model('Login', Schema);
module.exports = { LoginSchema, LoginValidate };