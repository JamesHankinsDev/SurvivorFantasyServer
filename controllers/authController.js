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

    return res.status(200).json({ token, role, role: role, name: username });
  } catch (err) {
    console.error('RegisterError: ', err);
    return res.status(400).json({ error: 'Error registering user' });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.error({ message: 'Login Error: No username found' });
      return res.status(400).json({ error: 'This User was not found' });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.error({ message: 'Login Error: Password is incorrect' });
      return res.status(400).json({
        error: 'There is a problem with your credentials, please try again',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return res.status(200).json({ token, role: user.role, name: username });
  } catch (err) {
    console.error({ message: 'Login error: ' + err });
    return res.status(500).json({ error: 'Unknown Login Error' });
  }
};
