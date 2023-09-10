import expressAsyncHandler from 'express-async-handler';

import User from '../models/userModel.js';
import Appointment from '../models/appointmentModel.js';
import generateToken from '../utils/generateToken.js';

// @desc Auth user and get token
// @route POST /api/v1/users
// @access public
const authUser = expressAsyncHandler(async (req, res) => {
  const { universityId, password } = req.body;

  const user = await User.findOne({ universityId });

  if (user && (await user.matchPassword(password))) {
    return res.json({ token: generateToken(user._id) });
  }

  res.status(401);
  throw new Error('Invalid credentials!!!');
});

// @desc Register user and get token
// @route POST /api/v1/users/register
// @access public
const registerUser = expressAsyncHandler(async (req, res) => {
  const { universityId, password, name } = req.body;

  const userExists = await User.findOne({ universityId });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, universityId, password });

  if (user) {
    return res.json({ token: generateToken(user._id) });
  }

  res.status(401);
  throw new Error('Invalid user data!!');
});

export { authUser, registerUser };
