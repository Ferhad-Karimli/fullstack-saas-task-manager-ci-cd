const { SignUpSchema } = require('../../models/auth/signUp');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    
    const { email, password } = req.body;
    const user = await SignUpSchema.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
   
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, email, email: user.email },
      'SECRET_KEY', 
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

exports.userList = async (req,res) => {
  try{
    const users = await  SignUpSchema.find({})
      res.status(200).json({users})

  }
  catch(error){
    res.status(500).json({ message: 'Something went wrong' });
  }
}