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
  const result = await User.updateOne({
    _id: req.params.id,
  }, req.body);
  if (result.matchedCount) {
    res.status(200).json({ code: 200, msg: 'User Updated Successfully' });
  } else {
    res.status(404).json({ code: 404, msg: 'Unable to Update User' });
  }
});

// Update user profile
router.get('/profile', asyncHandler(async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ success: false, message: 'Authorization header missing' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.SECRET);
    
    const user = await User.findById(decoded._id); 
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
}));


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
    const token = jwt.sign({ username: user.username }, process.env.SECRET);
    res.status(200).json({ success: true, token: 'BEARER ' + token });
  } else {
    res.status(401).json({ success: false, msg: 'Wrong password.' });
  }
}

// Add a movie to favorites
router.post('/favorites', authenticate, async (req, res) => {
  try {
      const userId = req.user._id;
      const { movieId } = req.body;

      const user = await User.findById(userId);
      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Add movieId to favoriteMovies array if it doesn't already exist
      if (!user.favoriteMovies.includes(movieId)) {
          user.favoriteMovies.push(movieId);
          await user.save();
      }

      res.status(200).json({ message: 'Movie added to favorites' });
  } catch (error) {
      res.status(500).json({ message: 'Server error', error });
  }
});


// Remove a movie from favorites
router.delete('/favorites', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const { movieId } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    // Remove movie from favorites
    user.favoriteMovies = user.favoriteMovies.filter(id => id !== movieId);
    await user.save();

    res.status(200).json({ message: 'Movie removed from favorites', favorites: user.favoriteMovies });
  } catch (error) {
    res.status(500).json({ message: 'Error removing movie from favorites', error });
  }
});

// Get all favorite movies for the logged-in user
router.get('/favorites', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the user by ID and populate favorite movies
    const user = await User.findById(userId);

    res.status(200).json({ favorites: user.favoriteMovies });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorite movies', error });
  }
});


export default router;
