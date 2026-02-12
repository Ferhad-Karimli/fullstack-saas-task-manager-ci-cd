const Joi = require('joi');

const signupValidate = (data) => {
  const schema = Joi.object({
    userName: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
   });

  return schema.validate(data);
};

module.exports = {signupValidate};