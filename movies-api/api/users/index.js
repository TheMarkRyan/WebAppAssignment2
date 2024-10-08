import express from 'express';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import multer from 'multer';
import User from '../users/userModel.js';
import authenticate from '../../authenticate';

const router = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Path to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Get all users
router.get('/', asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
}));

// Register or Authenticate a user
router.post('/', asyncHandler(async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ success: false, msg: 'Username and password are required.' });
    }
    if (req.query.action === 'register') {
      await registerUser(req, res);
    } else {
      await authenticateUser(req, res);
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, msg: 'Internal server error.' });
  }
}));

// Update a user
router.put('/:id', async (req, res) => {
  if (req.body._id) delete req.body._id;
  const result = await User.updateOne({ _id: req.params.id }, req.body);
  if (result.matchedCount) {
    res.status(200).json({ code: 200, msg: 'User Updated Successfully' });
  } else {
    res.status(404).json({ code: 404, msg: 'Unable to Update User' });
  }
});

// Update user profile
router.put('/profile', upload.single('profilePic'), async (req, res) => {
  const { userId, bio } = req.body;
  const profilePic = req.file ? req.file.path : null;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    user.bio = bio || user.bio;
    user.profilePic = profilePic || user.profilePic;

    await user.save();
    res.status(200).json({ success: true, message: 'Profile updated successfully.', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Internal Server Error.' });
  }
});

// Add a movie to the watchlist
router.post('/watchlist', authenticate, async (req, res) => {
  try {
    // Verify user is authenticated and token is valid
    console.log("User ID from token:", req.user._id);
    
    const userId = req.user._id;
    const { movieId, title } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log("User found:", user.username);

    // Check if the movie is already in the watchlist
    if (!user.watchlist.some(movie => movie.id === movieId)) {
      // Add movie to watchlist
      user.watchlist.push({ id: movieId, title });
      await user.save();
      console.log("Movie added to watchlist:", { id: movieId, title });
    }

    res.status(200).json({ success: true, message: 'Movie added to watchlist', watchlist: user.watchlist });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Helper functions for register and authenticate
async function registerUser(req, res) {
  await User.create(req.body);
  res.status(201).json({ success: true, msg: 'User successfully created.' });
}

async function authenticateUser(req, res) {
  const user = await User.findByUserName(req.body.username);
  if (!user) {
    return res.status(401).json({ success: false, msg: 'Authentication failed. User not found.' });
  }

  const isMatch = await user.comparePassword(req.body.password);
  if (isMatch) {
    const token = jwt.sign(
      { username: user.username, _id: user._id }, // Include _id in the token payload
      process.env.SECRET,
      { expiresIn: '1h' } // Optional: Token expiry time
    );
    res.status(200).json({ success: true, token: 'BEARER ' + token });
  } else {
    res.status(401).json({ success: false, msg: 'Wrong password.' });
  }
}

export default router;
