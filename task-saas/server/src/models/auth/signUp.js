const { default: mongoose, Schema } = require('mongoose');
const Joi = require('joi');

const signUpSchema = mongoose.Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  dateOfBirth: {
    type: Date,
    required: false,
  },
});

const signUpValidate = (data) => {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
      .required(),
      password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).required(),
    dateOfBirth: Joi.date().optional(),
   
  });

  return schema.validate(data);
};
const SignUpSchema = mongoose.model('Login', signUpSchema);

module.exports = { SignUpSchema, signUpValidate };