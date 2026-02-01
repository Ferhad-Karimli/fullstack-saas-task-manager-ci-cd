const { UserSchema } = require('../../models/auth/userModel');
const { signupValidate } = require('../../validators/signUpValidator');

const bcrypt = require('bcrypt');

exports.signUp = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    const { error } = signupValidate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const exisitingUser = await UserSchema.findOne({ email });
    if (exisitingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserSchema({
      userName,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    res
      .status(201)
      .json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
