import express from 'express';
import asyncHandler from 'express-async-handler';
import User from '../users/userModel.js';
import authenticate from '../../authenticate';

const router = express.Router();

// Add a movie to favorites
router.post('/favorites', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { movieId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Add movieId to favoriteMovies array if it doesn't already exist
    if (!user.favoriteMovies.includes(movieId)) {
      user.favoriteMovies.push(movieId);
      await user.save();
    }

    res.status(200).json({ success: true, message: 'Movie added to favorites', favoriteMovies: user.favoriteMovies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', error });
  }
}));

// Remove a movie from favorites
router.delete('/favorites', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { movieId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Remove movieId from favoriteMovies array
    user.favoriteMovies = user.favoriteMovies.filter(id => id !== movieId);
    await user.save();

    res.status(200).json({ success: true, message: 'Movie removed from favorites', favoriteMovies: user.favoriteMovies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error removing movie from favorites', error });
  }
}));

// Get all favorite movies for the logged-in user
router.get('/favorites', authenticate, asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, favoriteMovies: user.favoriteMovies });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching favorite movies', error });
  }
}));
export const getWatchlist = async (authToken) => {
  const token = authToken.split(' ')[1]; // Get the token without the 'BEARER' prefix
  const url = `http://localhost:8080/api/users/watchlist`;
  const options = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Correct the Authorization header
    },
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Failed to fetch watchlist.");
  }

  const data = await response.json();
  return data.watchlist; 
};



export default router;
