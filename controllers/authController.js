const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const newUser = new User({ username, password, role });
    await newUser.save();

    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    res.status(200).json({ token, role, name: username });
  } catch (err) {
    console.error('RegisterError: ', err);
    res.status(400).json({ error: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.error({ message: 'No username found' });
      return res.status(400).json({ error: 'Invalid username or password!' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.error({ message: 'Password Incorrect' });
      return res.status(400).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ token, role: user.role, name: username });
  } catch (err) {
    console.error({ LoginError: err });
    res.status(500).json({ error: 'Login error' });
  }
};
