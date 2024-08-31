import express from 'express';
import asyncHandler from 'express-async-handler';
import authenticate from '../../authenticate';
import User from '../users/userModel.js';

const router = express.Router();

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
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

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
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({ favorites: user.favoriteMovies });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching favorite movies', error });
  }
});

// Add a movie to the watchlist
router.post('/watchlist', authenticate, async (req, res) => {
  try {
    const userId = req.user._id;
    const { movieId, title } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the movie is already in the watchlist
    const movieIndex = user.watchlist.findIndex(movie => movie.id === movieId);

    if (movieIndex > -1) {
      return res.status(400).json({ success: false, message: 'This movie is already in your watchlist.' });
    } else {
      // Movie is not in the watchlist, so add it
      user.watchlist.push({ id: movieId, title });
      await user.save();
      return res.status(200).json({ success: true, message: 'Movie added to watchlist', watchlist: user.watchlist });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
