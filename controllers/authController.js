const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.MAILER_ACCT,
    pass: process.env.MAILER_PASS,
  },
});

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
    return res
      .status(400)
      .json({ message: 'Error registering user', error: err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      console.error({ message: 'Login Error: No username found' });
      return res.status(400).json({ message: 'This User was not found' });
    }

    // user.

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      console.error({ message: 'Login Error: Password is incorrect' });
      return res.status(400).json({
        message: 'There is a problem with your credentials, please try again',
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '24h',
    });

    return res.status(200).json({ token, role: user.role, name: username });
  } catch (err) {
    console.error({ message: 'Login error: ' + err });
    return res
      .status(500)
      .json({ message: 'Unknown Login Error', error: err.message });
  }
};

exports.requestPasswordReset = async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: 'Tribe not found' });
    }

    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    const resetLink = `${req.headers.origin}/reset-password/${resetToken}`;

    await transporter.sendMail({
      from: 'no-reply@SurvivorFantasyLeague.com',
      to: email,
      subject: 'Reset your Password',
      html: `<p>You requested a password reset for ${username}. Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    return res
      .status(200)
      .json({ message: 'Password reset link sent to your email.' });
  } catch (error) {
    console.error({ message: error.message });
    return res
      .status(500)
      .json({ message: 'Error processing request', error: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const { id: userId } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error({ err });
    return res
      .status(500)
      .json({ message: 'Invalid or expired token', error: err.message });
  }
};
