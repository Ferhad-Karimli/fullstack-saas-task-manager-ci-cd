const { UserSchema } = require('../../models/auth/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { loginValidate } = require('../../validators/loginValidator');
require('dotenv').config();

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { error } = loginValidate(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
    const user = await UserSchema.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        userName: user.userName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

exports.userList = async (req, res) => {
  try {
    const users = await UserSchema.find({});
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};
